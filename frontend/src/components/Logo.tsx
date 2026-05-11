import { Link } from "@tanstack/react-router";

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 text-foreground font-bold text-base sm:text-lg shrink-0"
    >
      <img
        src="/livre.png"
        alt="Blablabook"
        className="w-5 h-5 sm:w-6 sm:h-6"
      />
      <span className="hidden sm:inline">Blablabook</span>
    </Link>
  );
}
