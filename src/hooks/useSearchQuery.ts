"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useSearchQuery = (initialQuery: string) => {
   const [query, setQuery] = useState(initialQuery);
   const router = useRouter();
   const searchParams = useSearchParams();

   useEffect(() => {
      const newQuery = searchParams.get("q") || "";
      if (newQuery !== query) {
         setQuery(newQuery);
      }
   }, [searchParams, query]);

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

   return {
      query,
      setQuery,
      handleSearch,
   };
};
