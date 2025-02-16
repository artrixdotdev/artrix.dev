"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UseTagFilterProps {
   initialTags: string[];
}

export const useTagFilter = ({ initialTags }: { initialTags: string[] }) => {
   const [tags, setTags] = useState(initialTags);
   const router = useRouter();
   const searchParams = useSearchParams();

   useEffect(() => {
      const newTags = searchParams.get("tags")?.split(",") || [];
      if (JSON.stringify(newTags) !== JSON.stringify(tags)) {
         setTags(newTags);
      }
   }, [searchParams, tags]);

   const toggleTag = (tag: string) => {
      const newTags = tags.includes(tag)
         ? tags.filter((t) => t !== tag)
         : [...tags, tag];

      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (newTags.length > 0) {
         current.set("tags", newTags.join(","));
      } else {
         current.delete("tags");
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`/blog${query}`);
   };

   const removeTag = (tagToRemove: string) => {
      toggleTag(tagToRemove);
   };

   return {
      tags,
      toggleTag,
      removeTag,
   };
};
