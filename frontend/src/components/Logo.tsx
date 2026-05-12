import { Link } from "@tanstack/react-router";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2 text-foreground font-bold text-base sm:text-lg shrink-0 ${className}`}
    >
      <img src="/book.svg" alt="Blablabook" className="w-5 h-5 sm:w-6 sm:h-6" />
      <span>Blablabook</span>
    </Link>
  );
}
