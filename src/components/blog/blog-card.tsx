"use client";
import Image from "next/image";
import Link from "next/link";
import {
   Card as HeroCard,
   CardBody as CardContent,
   CardFooter,
   CardHeader,
   Chip,
} from "@heroui/react";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/blog";
import TagChip from "./tag-chip";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import { Glow } from "../ui/glow";
//@ts-ignore
const MotionCard = motion.create(HeroCard);
const MotionImage = motion.create(Image);

export default function Card({
   post,
   color,
}: {
   post: BlogPost;
   color: string;
}) {
   return (
      <Glow className="rounded-md" color={color}>
         <MotionCard
            className="flex flex-col h-full border-default-200/50 border-1 bg-transparent hover:shadow-lg p-2 transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
         >
            <CardHeader className="text-2xl font-bold tracking-tight w-full">
               {post.metadata.image && (
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 0.2 }}
                     className="overflow-hidden rounded-md w-full"
                  >
                     <MotionImage
                        src={post.metadata.image || "/placeholder.svg"}
                        alt={post.metadata.title}
                        width={600}
                        height={400}
                        className="rounded-md object-cover w-full h-48 transition-transform"
                        whileHover={{ scale: 1.2 }}
                     />
                  </motion.div>
               )}
            </CardHeader>

            <CardContent className="flex-grow space-y-4">
               <h3 className="text-2xl font-bold tracking-tight">
                  {post.metadata.title}
               </h3>
               <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
               >
                  {post.metadata.tags?.map((tag, index) => (
                     <TagChip key={tag} tag={tag} />
                  ))}
               </motion.div>
               <p className="text-sm text-default-500">
                  {post.metadata.summary}
               </p>

               <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
               >
                  <Link
                     href={`/blog/${post.slug}`}
                     className="text-primary hover:underline inline-flex items-center space-x-1"
                  >
                     <span>Read more</span>
                     <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                     >
                        <ArrowRightIcon />
                     </motion.span>
                  </Link>
               </motion.div>
            </CardContent>

            <CardFooter className="flex justify-between items-center pt-4">
               <motion.span
                  className="text-sm inline-flex justify-start items-center gap-1 text-default-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
               >
                  <ClockIcon size={16} />
                  {post.readTime}
               </motion.span>
               <span className="font-mono font-semibold text-default-500">
                  {new Date(post.metadata.publishedAt).toLocaleDateString()}
               </span>
            </CardFooter>
         </MotionCard>
      </Glow>
   );
}
