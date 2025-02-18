"use client";

import { Button, Input } from "@heroui/react";
import TagFilter from "./tag-filter";
import TagChip from "./tag-chip";
import { tags } from "@/lib/tags";
import { useTagFilter } from "@/hooks/useTagFilter";
import { useSearchQuery } from "@/hooks/useSearchQuery";

interface SearchBarProps {
   initialQuery?: string;
   allTags: typeof tags;
   selectedTags: string[];
}

export default function SearchBar({
   initialQuery = "",
   allTags,
   selectedTags,
}: SearchBarProps) {
   const { query, setQuery, handleSearch } = useSearchQuery(initialQuery);
   const { tags, removeTag } = useTagFilter({
      initialTags: selectedTags,
   });

   return (
      <>
         <form onSubmit={handleSearch} className="flex gap-2">
            <Input
               type="text"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder="Search blog posts..."
               className="flex-grow"
            />
            <TagFilter allTags={allTags as any} selectedTags={selectedTags} />
            <Button type="submit">Search</Button>
         </form>
         {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
               {tags.map((tag) => (
                  <TagChip key={tag} tag={tag} onClose={() => removeTag(tag)} />
               ))}
            </div>
         )}
      </>
   );
}
