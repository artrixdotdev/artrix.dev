"use client";
import "@/styles/code-theme.css";
export default function BlogLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <div className="w-full flex flex-col mt-36 items-center justify-center">
         <div className="grid w-[800px] max-w-[80%] gap-8 mb-32">
            {children}
         </div>
      </div>
   );
}
