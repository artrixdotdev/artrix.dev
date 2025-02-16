"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Chip, Input } from "@heroui/react";
import { Button } from "@heroui/react";
import TagFilter from "./tag-filter";
import { Badge } from "lucide-react";
import { Tag } from "@/lib/tags";
import TagChip from "./tag-chip";

export default function SearchBar({
   initialQuery = "",
   allTags,
   selectedTags,
}: {
   initialQuery?: string;
   allTags: typeof tags;
   selectedTags: string[];
}) {
   const [query, setQuery] = useState(initialQuery);
   const [tags, setTags] = useState([] as string[]);
   const router = useRouter();
   const searchParams = useSearchParams();

   useEffect(() => {
      const newQuery = searchParams.get("q") || "";
      if (newQuery !== query) {
         setQuery(newQuery);
      }
   }, [searchParams, query]); // Added query to dependencies
   useEffect(() => {
      const newTags = searchParams.get("tags")?.split(",") || [];
      if (JSON.stringify(newTags) !== JSON.stringify(tags)) {
         setTags(newTags);
      }
   }, [searchParams, tags]); // Added tags to dependencies

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (query) {
         current.set("q", query);
      } else {
         current.delete("q");
      }
      const search = current.toString();
      const q = search ? `?${search}` : "";
      router.push(`/blog${q}`);
   };

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
            <TagFilter allTags={allTags} selectedTags={selectedTags} />
            <Button type="submit">Search</Button>
         </form>
         {tags.length > 0 && (
            <div className="flex gap-2 mt-6">
               {tags.map((tag) => (
                  <TagChip key={tag} tag={tag} onClose={() => {}} />
               ))}
            </div>
         )}
      </>
   );
}
