"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
   Autocomplete,
   AutocompleteItem,
   Button,
   Select,
   SelectItem,
} from "@heroui/react";
import { TagIcon } from "lucide-react";

export default function TagFilter({
   allTags,
   selectedTags: initialSelectedTags,
}: Record<string, string[]>) {
   const [selectedTags, setSelectedTags] = useState(initialSelectedTags);
   const router = useRouter();
   const searchParams = useSearchParams();

   useEffect(() => {
      const newTags = searchParams.get("tags")?.split(",") || [];
      if (JSON.stringify(newTags) !== JSON.stringify(selectedTags)) {
         setSelectedTags(newTags);
      }
   }, [searchParams, selectedTags]); // Added selectedTags to dependencies

   const toggleTag = (tag: string) => {
      const newSelectedTags = selectedTags.includes(tag)
         ? selectedTags.filter((t) => t !== tag)
         : [...selectedTags, tag];

      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (newSelectedTags.length > 0) {
         current.set("tags", newSelectedTags.join(","));
      } else {
         current.delete("tags");
      }
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`/blog${query}`);
   };

   return (
      <Select
         aria-label="Filter by tags"
         classNames={{
            base: "max-w-xs",
            listboxWrapper: "max-h-[320px]",
            //selectorButton: "text-default-500",
         }}
         selectionMode="multiple"
         selectedKeys={selectedTags}
         //checkedItems={selectedTags}
         placeholder="Filter by tags..."
         popoverProps={{
            offset: 10,
         }}
         startContent={
            <TagIcon className="text-default-400" size={20} strokeWidth={2.5} />
         }
         variant="underlined"
      >
         {allTags.map((tag) => (
            <SelectItem
               key={tag}
               onPress={() => toggleTag(tag)}
               aria-checked={selectedTags.includes(tag)}
               variant={"flat"}
               startContent={
                  <TagIcon
                     className="text-default-400"
                     size={20}
                     strokeWidth={2.5}
                  />
               }
            >
               {tag}
            </SelectItem>
         ))}
      </Select>
   );
}
