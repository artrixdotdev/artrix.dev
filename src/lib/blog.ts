import fs from "fs";
import path from "path";

export type Metadata = {
   title: string;
   publishedAt: string;
   summary: string;
   image?: string;
   tags?: string[];
};

export type BlogPost = {
   metadata: Metadata;
   slug: string;
   content: string;
   readTime: string;
};

function parseFrontmatter(fileContent: string) {
   let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
   let match = frontmatterRegex.exec(fileContent);
   let frontMatterBlock = match![1];
   let content = fileContent.replace(frontmatterRegex, "").trim();
   let frontMatterLines = frontMatterBlock.trim().split("\n");
   let metadata: Partial<Metadata> = {};

   frontMatterLines.forEach((line) => {
      const [_key, ...valueArr] = line.split(": ");
      let value = valueArr.join(": ").trim();
      value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
      let key = _key.trim() as keyof Metadata;
      metadata[key] = (
         key === "tags" ? value.split(",").map((tag) => tag.trim()) : value
      ) as string & string[];
   });

   return { metadata: metadata as Metadata, content };
}

function findMDXFiles(dir: string): string[] {
   const entries = fs.readdirSync(dir, { withFileTypes: true });
   let files: string[] = [];

   for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
         // Recursively search subdirectories
         files = files.concat(findMDXFiles(fullPath));
      } else if (entry.isFile() && /\.(mdx?|markdown)$/.test(entry.name)) {
         files.push(fullPath);
      }
   }

   return files;
}

function getSlugFromPath(filePath: string, baseDir: string): string {
   // Remove base directory and file extension
   const relativePath = path.relative(baseDir, filePath);
   const slugPath = relativePath.replace(/\.(mdx?|markdown)$/, "");

   // Handle both directory/article.mdx and directory.mdx patterns
   if (slugPath.endsWith("/article")) {
      return path.dirname(slugPath);
   }

   return slugPath;
}

function readMDXFile(filePath: string): {
   metadata: Metadata;
   content: string;
} {
   let rawContent = fs.readFileSync(filePath, "utf-8");
   return parseFrontmatter(rawContent);
}

function getMDXData(dir: string): BlogPost[] {
   const baseDir = path.resolve(dir);
   const mdxFiles = findMDXFiles(baseDir);

   return mdxFiles.map((filePath) => {
      const { metadata, content } = readMDXFile(filePath);
      const slug = getSlugFromPath(filePath, baseDir);

      return {
         metadata,
         slug,
         content,
         readTime: readTime(content),
      };
   });
}

export function getBlogPosts(): BlogPost[] {
   const postsDir = path.join(process.cwd(), "src", "app", "blog", "posts");
   return getMDXData(postsDir);
}

export function formatDate(date: string, includeRelative = false): string {
   let currentDate = new Date();
   if (!date.includes("T")) {
      date = `${date}T00:00:00`;
   }
   let targetDate = new Date(date);
   let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
   let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
   let daysAgo = currentDate.getDate() - targetDate.getDate();

   let formattedDate = "";
   if (yearsAgo > 0) {
      formattedDate = `${yearsAgo}y ago`;
   } else if (monthsAgo > 0) {
      formattedDate = `${monthsAgo}mo ago`;
   } else if (daysAgo > 0) {
      formattedDate = `${daysAgo}d ago`;
   } else {
      formattedDate = "Today";
   }

   let fullDate = targetDate.toLocaleString("en-us", {
      month: "long",
      day: "numeric",
      year: "numeric",
   });

   if (!includeRelative) {
      return fullDate;
   }
   return `${fullDate} (${formattedDate})`;
}

export function readTime(content: string): string {
   let words = content.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/);
   let time = 0;

   for (let word of words) {
      if (word.length < 3) continue;
      if (/^(a|an|the|in|and)$/i.test(word) || word.length < 2) {
         time += 1;
      }
   }

   if (time >= 3600) return `${Math.floor(time / 3600)}h`;
   if (time >= 60) return `${Math.floor(time / 60)}m`;
   return `${time}s`;
}
