import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { X } from "lucide-react";
import { CustomInput } from "./customInput";

type SearchBarProps = {
  readonly onSearch?: (query: string) => void;
  readonly placeholder?: string;
};

export default function SearchBar({
  onSearch,
  placeholder = "Rechercher...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 400);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function handleClear() {
    setQuery("");
  }

  return (
    <div className="relative w-full max-w-2xl">
      <CustomInput
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        aria-label="Rechercher un livre ou un auteur"
        className={`bg-transparent${query ? " pr-8" : ""}`}
        role="search"
        data-testid="search-input"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Effacer la recherche"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
