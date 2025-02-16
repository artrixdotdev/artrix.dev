import { getBlogPosts } from "@/lib/blog";
import SearchBar from "@/components/blog/search-bar";
import TagFilter from "@/components/blog/tag-filter";
import BlogGrid from "@/components/blog/blog-grid";
import { tags as allTags } from "@/lib/tags";
export default async function BlogHome({ searchParams }: any) {
   const allPosts = getBlogPosts();
   const { q, tags } = await searchParams;
   const searchQuery = typeof q === "string" ? q : "";
   const tagFilters = typeof tags === "string" ? tags.split(",") : [];

   const filteredPosts = allPosts.filter((post) => {
      const matchesSearch = post.metadata.title
         .toLowerCase()
         .includes(searchQuery.toLowerCase());
      const matchesTags =
         tagFilters.length === 0 ||
         tagFilters.every((tag) => post.metadata.tags?.includes(tag));
      return matchesSearch && matchesTags;
   });

   return (
      <div className="container mt-36 mx-auto px-4 py-8">
         <h1 className="text-4xl font-bold mb-8">Blog</h1>
         <div className="mb-8">
            <SearchBar
               initialQuery={searchQuery}
               allTags={allTags as any}
               selectedTags={tagFilters}
            />
         </div>

         <BlogGrid posts={filteredPosts} />
      </div>
   );
}
