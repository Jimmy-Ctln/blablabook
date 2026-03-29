import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
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

  return (
    <div className="w-full max-w-md">
      <CustomInput
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        aria-label="Rechercher un livre ou un auteur"
        className="bg-transparent"
        role="search"
      />
    </div>
  );
}
