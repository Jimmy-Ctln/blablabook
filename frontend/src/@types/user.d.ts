export interface UserProps {
  id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  roles: string;
}

export type User = UserProps;

export type SelectedAvatar = {
  id: string;
  sexe: string;
  source: string;
};
