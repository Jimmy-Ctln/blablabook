import type {
  ExternalBook,
  ExternalBookDisplayData,
  ExternalApiIsbnResponse,
  ExternalApiWorkResponse,
  ExternalApiAuthorResponse,
  GetExternalBooksParams,
  WorkSearchDoc,
  EditionData,
} from "../@types/externalBooks";
import externalApi from "./axiosExternal";
import { getRandomQuery } from "../lib/utils";

// -----------------------------
// CONSTANTS
// -----------------------------

const DEFAULT_COVER = "/default-book-cover.png";

// -----------------------------
// HELPERS
// -----------------------------

const parseDescription = (desc: unknown): string => {
  if (!desc) return "";
  if (typeof desc === "string") return desc;
  
  if (typeof desc === "object" && desc !== null && "value" in desc) {
    const obj = desc as { value: unknown };
    if (typeof obj.value === "string") {
      return obj.value;
    }
  }
  
  return "";
};

const buildCoverUrl = (edition: EditionData): string => {
  const coverId = edition.covers?.[0];
  return coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : DEFAULT_COVER;
};

const createExternalBook = (
  edition: EditionData,
  work: WorkSearchDoc,
  isbn: string,
  coverUrl: string,
  description: string,
  categories?: string[],
): ExternalBook => {
  return {
    key: edition.key,
    title: edition.title,
    author:
      work.author_name?.[0] || edition.authors?.[0]?.name || "Auteur inconnu",
    isbn,
    language: edition.languages,
    publishDate: edition.publish_date,
    cover: coverUrl,
    description: description || undefined,
    publisher: edition.publishers?.[0],
    categories: categories || [],
  };
};

// Filter work results early to avoid unnecessary API calls
const filterSearchResults = (
  works: WorkSearchDoc[],
  searchText: string,
): WorkSearchDoc[] => {
  const searchLower = searchText.toLowerCase();
  return works.filter((work) => {
    const title = (work.title || "").toLowerCase();
    const author = (work.author_name?.[0] || "").toLowerCase();
    return title.includes(searchLower) || author.includes(searchLower);
  });
};

// -----------------------------
// SEARCH EXTERNAL BOOK WITH SEARCH BY TITLE OR AUTHOR, RANDOM OR BY CATEGORY)
// -----------------------------

export const searchExternalBooks = async (
  params: GetExternalBooksParams,
): Promise<ExternalBook[]> => {
  let q = "";

  if (params.type === "random") {
    q = getRandomQuery();
  } else if (params.type === "searchText") {
    if (!params.searchText) throw new Error("Missing search text");
    q = params.searchText;
  } else if (params.type === "category") {
    if (!params.categoryName) throw new Error("Missing category name");
    q = params.categoryName;
  }

  const response = await externalApi.get("/search.json", {
    params: {
      q,
      limit: 20,
      fields: "key,title,author_name,edition_key,subject",
    },
  });

  const docs: WorkSearchDoc[] = response.data.docs || [];
  const books: ExternalBook[] = [];

  let searchText = "";
  if (params.type === "searchText") {
    searchText = params.searchText || "";
  }

  // Filter early on search results before fetching editions
  const filteredDocs = filterSearchResults(docs, searchText);

  for (const work of filteredDocs) {
    if (!work.edition_key || work.edition_key.length === 0) continue;

    const editionKey = work.edition_key[0];
    try {
      const editionResponse = await externalApi.get<EditionData>(
        `/books/${editionKey}.json`,
      );
      const edition = editionResponse.data;

      const isbn = edition.isbn_13?.[0] || "";
      if (!isbn) continue;

      const coverUrl = buildCoverUrl(edition);
      const categories = work.subject || [];

      books.push(
        createExternalBook(edition, work, isbn, coverUrl, "", categories),
      );
    } catch (err) {
      console.warn(`Failed to fetch edition ${editionKey}:`, err);
    }
  }
  return books;
};

// -----------------------------
// API functions
// -----------------------------

// GET Book ISBN Data
export const getOpenLibIsbnData = async (
  isbn: string,
): Promise<ExternalApiIsbnResponse> => {
  const response = await externalApi.get<ExternalApiIsbnResponse>(
    `/isbn/${isbn}.json`,
  );
  return response.data;
};

// GET Book Work Data
export const getOpenLibWorkData = async (
  workKey: string,
): Promise<ExternalApiWorkResponse> => {
  const response = await externalApi.get<ExternalApiWorkResponse>(
    `${workKey}.json`,
  );
  return response.data;
};

// GET Book Author Data
export const getOpenLibAuthorData = async (
  authorKey: string,
): Promise<ExternalApiAuthorResponse> => {
  const response = await externalApi.get<ExternalApiAuthorResponse>(
    `${authorKey}.json`,
  );
  return response.data;
};

// -----------------------------
// PRINCIPAL FUNCTION FOR BOOK DETAILS
// -----------------------------

export const getFullExternalBook = async (
  isbn: string,
): Promise<ExternalBookDisplayData> => {
  // MAPPING DATA FROM MULTIPLE CALLS
  const dataIsbn = await getOpenLibIsbnData(isbn);
  const workKey = dataIsbn.works?.[0]?.key;
  const authorKey = dataIsbn.authors?.[0]?.key;
  const [dataWork, dataAuthor] = await Promise.all([
    workKey
      ? getOpenLibWorkData(workKey)
      : Promise.resolve({} as ExternalApiWorkResponse),
    authorKey
      ? getOpenLibAuthorData(authorKey)
      : Promise.resolve({
          name: "Auteur inconnu",
        } as ExternalApiAuthorResponse),
  ]);
  const coverId = dataIsbn.covers?.[0] || dataWork.covers?.[0];
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : DEFAULT_COVER;

  return {
    isbn: isbn,
    title: dataIsbn.title,
    authors: [dataAuthor.name || "Inconnu"],
    cover: coverUrl,
    description: parseDescription(dataWork.description),
    publisher: dataIsbn.publishers?.[0] || "Éditeur inconnu",
    publishedAt: dataIsbn.publish_date || "",
    pages: dataIsbn.number_of_pages || 0,
    language: dataIsbn.languages?.[0]?.key?.split("/").pop() || "en",
    categories: dataWork.subjects || [],
  };
};
