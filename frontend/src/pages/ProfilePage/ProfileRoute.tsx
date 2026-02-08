import { useCurrentUser } from "@/hooks/useCurrentUser";
import ProfilePage from "./ProfilePage";

const ProfileRoute = () => {
  const { data: currentUser, isLoading, isError } = useCurrentUser();

  if (isLoading) return <div className="p-8 text-center">Chargement...</div>;
  if (isError) return <div className="p-8 text-center text-destructive">Impossible de charger le profil</div>;

  return <ProfilePage currentUser={currentUser!} />;
};

export default ProfileRoute;