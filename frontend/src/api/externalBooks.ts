import type {
  ExternalBook,
  ExternalBookDisplayData,
  ExternalApiIsbnResponse,
  ExternalApiWorkResponse,
  ExternalApiAuthorResponse,
  GetExternalBooksParams,
  WorkSearchDoc,
  SearchBooksResponse,
} from "../@types/externalBooks";
import externalApi from "./axiosExternal";
import { getRandomQuery } from "../lib/utils";

// Builds an OpenLibrary cover URL for a given cover ID. Size: S=small, M=medium, L=large.
const buildCoverUrl = (
  coverId: number | undefined,
  size: "S" | "M" | "L" = "M",
): string | undefined =>
  coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
    : undefined;

// OpenLibrary's description field can be either a plain string or an object
// { value: string } depending on the endpoint version — normalize both forms.
const parseDescription = (desc: unknown): string => {
  if (!desc) return "";
  if (typeof desc === "string") return desc;
  if (typeof desc === "object" && desc !== null && "value" in desc) {
    const obj = desc as { value: unknown };
    if (typeof obj.value === "string") return obj.value;
  }
  return "";
};

// ISBN-13 is exactly 13 characters; ISBN-10 is 10.
// We only store ISBN-13 to avoid duplicates in the database.
const getISBN13 = (isbns: string[] | undefined): string | undefined => {
  if (!isbns || isbns.length === 0) return undefined;
  return isbns.find((isbn) => isbn.length === 13);
};

// Searches OpenLibrary for books by text query, random subject, or category.
// Results are restricted to French editions via the `language=fre` param.
//
// Key optimization: the `fields` param embeds edition data directly in the
// search response, so we never need a separate /books/{key} round-trip per result.
//
// Step 1 — Build the search query string from the requested mode.
// Step 2 — Fetch up to 30 works from /search.json with embedded French editions.
// Step 3 — Walk each work's editions; pick the first one with an ISBN-13.
//           Stop as soon as `limit` valid books have been collected.
export const searchExternalBooks = async (
  params: GetExternalBooksParams,
): Promise<SearchBooksResponse> => {
  // Step 1: resolve the query string.
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

  const limit = params.limit ?? 10;
  const offset = params.offset ?? 0;

  // Step 2: fetch works with embedded French editions.
  // 30 candidates is enough to reliably fill `limit` results — French books
  // have good ISBN-13 coverage so the hit rate is high.
  const response = await externalApi.get("/search.json", {
    params: {
      q,
      limit: 30,
      offset,
      language: "fre",
      fields:
        "key,title,author_name,first_publish_year,cover_i,subject,editions,editions.key,editions.title,editions.isbn,editions.covers",
    },
  });

  const docs: WorkSearchDoc[] = response.data.docs || [];
  const numFound: number = response.data.numFound || 0;

  // Step 3: for each work, find its first edition with an ISBN-13 and build
  // an ExternalBook. Stop early once we have `limit` results.
  const results: ExternalBook[] = [];

  for (const work of docs) {
    if (results.length >= limit) break;

    const editions = work.editions?.docs || [];
    if (editions.length === 0) continue;

    let book: ExternalBook | undefined;
    for (const edition of editions) {
      const isbn = getISBN13(edition.isbn);
      if (!isbn) continue;

      // Prefer the edition's own cover; fall back to the work-level cover.
      const coverId = edition.covers?.[0] ?? work.cover_i;
      const coverUrl = buildCoverUrl(coverId);

      book = {
        key: edition.key || "",
        title: edition.title || work.title,
        author: work.author_name?.[0] || "Auteur inconnu",
        isbn,
        publishDate: work.first_publish_year?.toString(),
        cover: coverUrl,
        description: undefined,
        publisher: undefined,
        categories: work.subject || [],
        workKey: work.key,
        editionCount: work.editions?.numFound || 1,
      };
      break;
    }

    if (book) results.push(book);
  }

  return { books: results, numFound, offset };
};

// Fetches the full edition record for a given ISBN-13.
export const getOpenLibIsbnData = async (
  isbn: string,
): Promise<ExternalApiIsbnResponse> => {
  const response = await externalApi.get<ExternalApiIsbnResponse>(
    `/isbn/${isbn}.json`,
  );
  return response.data;
};

// Fetches the work record (description, subjects, covers) for a given work key.
export const getOpenLibWorkData = async (
  workKey: string,
): Promise<ExternalApiWorkResponse> => {
  const response = await externalApi.get<ExternalApiWorkResponse>(
    `${workKey}.json`,
  );
  return response.data;
};

// Fetches the author record (name) for a given author key.
export const getOpenLibAuthorData = async (
  authorKey: string,
): Promise<ExternalApiAuthorResponse> => {
  const response = await externalApi.get<ExternalApiAuthorResponse>(
    `${authorKey}.json`,
  );
  return response.data;
};

// Builds a complete book display object by merging data from three endpoints.
//
// Step 1 — Fetch the edition by ISBN: gives title, cover IDs, publisher,
//           page count, language, and the work/author keys needed for step 2.
// Step 2 — Fetch work + author in parallel using those keys: gives description
//           and subjects (work) and the author's display name.
// Step 3 — Merge everything; prefer edition-level data, fall back to work-level.
export const getFullExternalBook = async (
  isbn: string,
): Promise<ExternalBookDisplayData> => {
  // Step 1: edition data.
  const dataIsbn = await getOpenLibIsbnData(isbn);
  const workKey = dataIsbn.works?.[0]?.key;
  const authorKey = dataIsbn.authors?.[0]?.key;

  // Step 2: work and author fetched in parallel to minimise latency.
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

  // Step 3: merge. Use -L suffix for the detail page cover (larger than search's -M).
  const coverId = dataIsbn.covers?.[0] || dataWork.covers?.[0];
  const coverUrl = buildCoverUrl(coverId, "L");

  return {
    isbn,
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
