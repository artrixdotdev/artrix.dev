import { type ManifestConfig, generateManifest } from "material-icon-theme";
import { cache } from "react";
import { cn } from "@heroui/react";

// Cache the manifest generation
const getManifest = cache(() => {
   const config: ManifestConfig = {};
   return generateManifest(config);
});

// Cache the icon loading
const loadIcon = cache(async (iconPath: string) => {
   try {
      // Using require instead of dynamic import for server-side
      const icon = require(`material-icon-theme/icons/${iconPath}.svg`);
      return icon.default || icon;
   } catch (error) {
      return null;
   }
});

export async function CodeIcon({
   filename,
}: {
   filename: string | null;
}): Promise<JSX.Element | null> {
   if (!filename) return null;

   const manifest = getManifest();
   if (!manifest) return null;

   const darkIconName = manifest.fileNames?.[filename];
   const lightIconName = manifest.light?.fileNames?.[filename];

   if (!darkIconName) return null;

   const [darkIcon, lightIcon] = await Promise.all([
      darkIconName ? loadIcon(darkIconName) : Promise.resolve(null),
      lightIconName ? loadIcon(lightIconName) : Promise.resolve(null),
   ]);

   if (!darkIcon && !lightIcon) return null;

   return (
      <div className="relative w-6 h-6">
         <img
            src={lightIcon?.src ?? darkIcon.src}
            alt={`${filename} file icon light`}
            className={cn("w-6 h-6", lightIcon ? "dark:hidden" : "block")}
         />
         <img
            src={darkIcon.src}
            alt={`${filename} file icon`}
            className={cn(
               "w-6 h-6",
               lightIcon ? "hidden dark:block" : "hidden",
            )}
         />
      </div>
   );
}
