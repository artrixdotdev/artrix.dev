"use client";
import { Select, SelectItem } from "@heroui/react";
import { TagIcon } from "lucide-react";
import { useTagFilter } from "@/hooks/useTagFilter";

interface TagFilterProps {
   allTags: string[];
   selectedTags: string[];
}

export default function TagFilter({
   allTags,
   selectedTags: initialSelectedTags,
}: TagFilterProps) {
   const { tags: selectedTags, toggleTag } = useTagFilter({
      initialTags: initialSelectedTags,
   });

   return (
      <Select
         aria-label="Filter by tags"
         classNames={{
            base: "max-w-xs",
            listboxWrapper: "max-h-[320px]",
         }}
         selectionMode="multiple"
         selectedKeys={selectedTags}
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
               variant="flat"
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
