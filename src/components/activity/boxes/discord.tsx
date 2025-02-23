import { BentoBox, BentoSizes } from "@/components/bento";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { type BoxType } from ".";
import { SOCIAL_HANDLES } from "@/config/site";

const label = "discord";
const size: BentoSizes = "compact";

const Bento = () => {
   return (
      <BentoBox
         className="p-6 flex items-center gap-2 justify-center flex-col"
         id={label}
         size={size}
      >
         <SiDiscord size={48} />
         <div className="text-center">{SOCIAL_HANDLES.discord}</div>
      </BentoBox>
   );
};

export const DiscordBento = [Bento, { label, size }] as BoxType;
