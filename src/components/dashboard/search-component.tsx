import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";

interface SearchComponentProps {
  className?: string;
  onSearch?: (query: string) => void;
}

export const SearchComponent = ({
  className,
  onSearch,
}: SearchComponentProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchRef.current?.value;
    if (query && onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className={`relative hidden sm:flex items-center ${className}`}>
      <AnimatePresence initial={false}>
        {!isSearchOpen ? (
          <motion.button
            key="search-icon"
            className="p-2 rounded-full hover:bg-muted transition"
            onClick={() => {
              setIsSearchOpen(true);
              setTimeout(() => searchRef.current?.focus(), 100);
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        ) : (
          <motion.div
            key="search-input"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "16rem", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                type="search"
                placeholder="Search..."
                className="pl-9 rounded-full bg-muted border-none ring-1 ring-transparent focus:ring-2 focus:ring-blue-500"
                onBlur={() => setIsSearchOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setIsSearchOpen(false);
                }}
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
