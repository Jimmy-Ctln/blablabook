import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { CustomInput } from "./customInput";

type SearchBarProps = {
  readonly onSearch: (query: string) => void;
  readonly spacingClassName?: string;
  readonly placeholder?: string;
};

export default function SearchBar({ onSearch, placeholder }: SearchBarProps) {
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
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(query);
      }}
      role="search"
    >
      <CustomInput
        type="text"
        placeholder={placeholder ?? "Rechercher..."}
        value={query}
        onChange={handleChange}
        aria-label="Rechercher un livre ou un auteur"
        className="bg-transparent"
      />
    </form>
  );
}
