"use client";
import { BentoBox, BentoSizes } from "@/components/bento";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { type BoxType } from ".";
import { SOCIAL_HANDLES } from "@/config/site";
import { addToast } from "@heroui/react";

export const label = "discord";
export const size: BentoSizes = "tall";

export const Bento = () => {
   return (
      <BentoBox
         onClick={() => {
            navigator.clipboard.writeText(SOCIAL_HANDLES.discord);
            addToast({
               title: "Copied to clipboard",
               color: "success",
            });
         }}
         className="p-6 flex items-center gap-2 justify-center cursor-pointer flex-col"
         id={label}
         size={size}
      >
         <SiDiscord size={48} />
         <div className="text-center">{SOCIAL_HANDLES.discord}</div>
      </BentoBox>
   );
};
