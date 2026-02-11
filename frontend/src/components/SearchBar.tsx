import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type SearchBarProps = {
  readonly onSearch: (query: string) => void;
  readonly spacingClassName?: string;
  readonly placeholder?: string;
};

export default function SearchBar({
  onSearch,
  spacingClassName,
  placeholder,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery.length === 0) {
      onSearch("");
    } else if (debouncedQuery.length >= 2) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  return (
    <form
      className={`w-full max-w-md border mx-auto flex items-center bg-chart-2 rounded-xl shadow gap-2 px-6 sm:max-w-lg md:max-w-xl`}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(query);
      }}
      role="search"
    >
      <Search className="h-5 w-5" aria-hidden="true" />
      <Input
        type="text"
        placeholder={placeholder ?? "Rechercher..."}
        value={query}
        onChange={handleChange}
        aria-label="Rechercher un livre ou un auteur"
        className="flex-1 border-none"
      />
    </form>
  );
}
