export type User = {
  id: number;
  username: string;
  email: string;
  image?: string | null;
}

export type UpdateUserInput = {
  username: string;
  email: string;
  password?: string;
  image?: string;
};