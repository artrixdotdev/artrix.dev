"use client";
import { SITE_CONFIG } from "@/config/site";
import { addToast, Switch } from "@heroui/react";
import { Link } from "@heroui/react";
import { GithubIcon, LogoText, MoonIcon, SunIcon } from "@/components/icons";
import { SiDiscord as DiscordIcon } from "@icons-pack/react-simple-icons";
import { useTheme } from "next-themes";
import { link } from "@heroui/react";

export function Footer() {
   const { setTheme, resolvedTheme: theme } = useTheme();
   console.log(theme);
   const socials = SITE_CONFIG.links;
   return (
      <footer id="footer" className="container mx-auto px-4 py-10">
         <div className="flex flex-col space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center text-foreground">
               <LogoText height="50" width="200" fill="currentColor" />

               <div className="flex space-x-4">
                  <button
                     className={link({ color: "foreground" })}
                     onMouseDown={() => {
                        navigator.clipboard.writeText(
                           SITE_CONFIG.handles.discord,
                        );
                        addToast({
                           title: "Copied to clipboard",
                           color: "success",
                        });
                     }}
                  >
                     <DiscordIcon className="h-6 w-6" />
                  </button>
                  <Link href={socials.github} color="foreground">
                     <GithubIcon className="h-6 w-6" />
                  </Link>
               </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex justify-center">
               <Switch
                  classNames={{
                     thumb: "bg-background",
                     endContent: "fill-background stroke-background",
                     wrapper: "!bg-foreground",
                  }}
                  isSelected={theme === "light"}
                  startContent={<SunIcon />}
                  endContent={<MoonIcon />}
                  onValueChange={(c) => setTheme(c ? "light" : "dark")}
                  id="theme-toggle"
               />
            </div>

            {/* Copyright and Credits */}
            <div className="text-center text-foreground">
               <p className="text-sm">
                  &copy; {new Date().getFullYear()} Artrix. All rights reserved.
               </p>
               <p className="text-sm mt-2">
                  Made with love by{" "}
                  <Link
                     href={socials.github}
                     className="font-bold"
                     underline="hover"
                     color="foreground"
                  >
                     @Artrix
                  </Link>{" "}
                  using{" "}
                  <Link
                     href="https://tailwindcss.com/"
                     className="font-bold"
                     underline="hover"
                     color="foreground"
                  >
                     Tailwind
                  </Link>{" "}
                  &{" "}
                  <Link
                     href="https://nextjs.org/"
                     className="font-bold"
                     underline="hover"
                     color="foreground"
                  >
                     Next.js
                  </Link>
               </p>
            </div>
         </div>
      </footer>
   );
}
