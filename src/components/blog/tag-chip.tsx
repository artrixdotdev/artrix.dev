"use client";
import { Tag, tags } from "@/lib/tags";
import { Chip, ChipProps, ChipVariantProps } from "@heroui/react";
import { FlameIcon, TagIcon } from "lucide-react";

type TagConfig = {
   icon: React.ReactNode;
} & ChipVariantProps;

const tagConfigs: Partial<Record<Tag, TagConfig>> = {
   "hot-take": {
      icon: <FlameIcon className="w-4 h-4" />,
      variant: "flat",
      color: "danger",
   },
};

const defaultConfig: TagConfig = {
   icon: <TagIcon className="w-4 h-4" />,
   variant: "flat",
   color: "secondary",
};

export default function TagChip({
   tag,
   ...userProps
}: { tag: string } & ChipProps) {
   const { icon, ...props }: TagConfig = tags.includes(tag as Tag)
      ? { ...defaultConfig, ...tagConfigs[tag as Tag] }
      : defaultConfig;

   return (
      <Chip startContent={icon} {...props} {...(userProps as any)}>
         {tag}
      </Chip>
   );
}
