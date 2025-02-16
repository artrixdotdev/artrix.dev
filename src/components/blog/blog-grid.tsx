import { gradientColors } from "@/config/site";
import { GlowArea } from "../ui/glow";
import BlogCard from "./blog-card";
import type { BlogPost } from "@/lib/blog";

export default function BlogGrid({ posts: _posts }: { posts: BlogPost[] }) {
   // Duplicate posts 30 times
   let posts = Array.from({ length: 30 })
      .map((_) => _posts)
      .flat();

   return (
      <GlowArea className="grid items-center justify-center grid-cols-[repeat(auto-fit,minmax(min(428px,100%),600px))] gap-6">
         {posts.map((post, i) => (
            <BlogCard
               color={gradientColors[i % gradientColors.length]}
               key={post.slug + i}
               post={post}
            />
         ))}
      </GlowArea>
   );
}
