import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { formatDate, getBlogPosts } from "@/lib/blog";
import { baseUrl } from "@/app/sitemap";
import { Clock } from "lucide-react";
import { Avatar, Chip } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import TagChip from "@/components/blog/tag-chip";

export async function generateStaticParams() {
   let posts = getBlogPosts();

   return posts.map((post) => ({
      slug: post.slug,
   }));
}

export async function generateMetadata({
   params,
}: {
   params: { slug: string };
}) {
   const { slug } = await params;
   const post = getBlogPosts().find((post) => post.slug === slug);
   if (!post) {
      return null;
   }

   const {
      title,
      publishedAt: publishedTime,
      summary: description,
      image,
   } = post.metadata;
   const ogImage = image
      ? image
      : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

   return {
      title,
      description,
      openGraph: {
         title,
         description,
         type: "article",
         publishedTime,
         url: `${baseUrl}/blog/${post.slug}`,
         images: [
            {
               url: ogImage,
            },
         ],
      },
      twitter: {
         card: "summary_large_image",
         title,
         description,
         images: [ogImage],
      },
   };
}

export default async function Blog({ params }: { params: { slug: string } }) {
   const { slug } = await params;
   const post = getBlogPosts().find((post) => post.slug === slug);

   if (!post) {
      notFound();
   }

   const ogImage = post.metadata.image
      ? post?.metadata.image
      : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`;
   return (
      <section>
         <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
               __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "BlogPosting",
                  headline: post.metadata.title,
                  datePublished: post.metadata.publishedAt,
                  dateModified: post.metadata.publishedAt,
                  description: post.metadata.summary,
                  image: ogImage,
                  author: {
                     "@type": "Person",
                     name: "Artrix",
                  },
               }),
            }}
         />
         <h1 className="font-semibold text-5xl tracking-tighter">
            {post.metadata.title}
         </h1>
         <div className="flex justify-between items-center mt-2 mb-8 text-sm">
            <div className="flex gap-2 items-center justify-center">
               <Avatar
                  src="/favicon.svg"
                  size="sm"
                  alt="Artrix"
                  className="border border-default-300"
               />
               <div className="flex flex-col gap-0.5">
                  <p className="font-semibold">Artrix</p>
                  <p className="text-sm text-foreground-500">
                     <span className="inline-flex gap-1 items-center justify-center">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                     </span>{" "}
                     | {formatDate(post.metadata.publishedAt)}
                  </p>
               </div>
            </div>
            {post.metadata.tags && (
               <ul className="flex gap-2 items-center">
                  {post.metadata.tags.slice(0, 3).map((tag) => (
                     <TagChip
                        tag={tag}
                        key={tag}
                        as={Link}
                        size="sm"
                        //@ts-ignore
                        href={`/blog?tags=${tag}`}
                     />
                  ))}
                  {post.metadata.tags.length > 3 && (
                     <Chip
                        as="li"
                        size="sm"
                        color="primary"
                        variant="flat"
                        endContent
                     >
                        {post.metadata.tags.length - 3} more...
                     </Chip>
                  )}
               </ul>
            )}
         </div>
         <img
            src={ogImage}
            alt={post.metadata.title}
            width={1200}
            height={630}
            className="rounded-md mb-20 shadow-2xl"
         />
         <article
            style={{
               fontSize: "20px",
               lineHeight: "28px",
            }}
         >
            <CustomMDX source={post.content} />
         </article>
      </section>
   );
}
