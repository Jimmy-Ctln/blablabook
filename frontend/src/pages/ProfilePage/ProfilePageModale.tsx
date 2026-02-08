import type { User } from "../../@types/user";
import UpdateUserForm from "./UpdateUserForm";
import { X } from "lucide-react";

type ProfileModalProps = {
  userId: number;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
};

export default function ProfileModal({
  userId,
  onClose,
  onUpdate,
}: ProfileModalProps) {
  return (
    <div className="fixed p-2 inset-0 bg-gray-400/50 flex justify-center items-center z-50">
      <div className="bg-white w-full p-4 rounded-xl shadow max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          <X size={20} color="black" />
        </button>
        <h2 className="text-lg flex justify-center font-semibold mb-2">
          Modifier mon profil
        </h2>
        <UpdateUserForm
          userId={userId}
          onClose={onClose}
          onUpdate={(updatedFields) => {
            onUpdate({ id: userId, ...updatedFields });
          }}
        />
      </div>
    </div>
  );
}
