export type ExternalBook = {
  key: string;
  title: string;
  author: string;
  isbn: string;
  publishDate?: string;
  cover?: string;
  description?: string;
  publisher?: string;
  categories: string[];
  workKey?: string;
  editionCount?: number;
};

export type UseExternalBooksOptions = {
  mode: "search" | "random" | "category";
  param?: string;
  enabled?: boolean;
};

export interface EditionInSearch {
  key?: string;
  title: string;
  isbn?: string[];
  covers?: number[];
}

export interface EditionsResponse {
  docs?: EditionInSearch[];
  numFound?: number;
}

export interface WorkSearchDoc {
  key: string;
  title: string;
  author_name?: string[];
  subject?: string[];
  first_publish_year?: number;
  cover_i?: number;
  editions?: EditionsResponse;
}

export type GetExternalBooksParams = {
  type: "random" | "searchText" | "category";
  searchText?: string;
  categoryName?: string;
  limit?: number;
  offset?: number;
};

export type SearchBooksResponse = {
  books: ExternalBook[];
  numFound: number;
  offset: number;
};

export type ExternalBookDisplayData = {
  title: string;
  authors: string[];
  cover?: string;
  description: string;
  isbn: string;
  publisher: string;
  publishedAt: string;
  pages: number;
  language: string;
  categories: string[];
};

export type ExternalApiIsbnResponse = {
  title?: string;
  covers?: number[];
  authors?: Array<{ key: string }>;
  works?: Array<{ key: string }>;
  publishers?: string[];
  publish_date?: string;
  number_of_pages?: number;
  languages?: Array<{ key: string }>;
};

export type ExternalApiWorkResponse = {
  description?: string | { value: string };
  subjects?: string[];
  covers?: number[];
};

export type ExternalApiAuthorResponse = {
  name: string;
};
