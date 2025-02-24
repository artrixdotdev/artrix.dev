"use client";
import { getContributions } from "@/lib/github";
import { title } from "@/components/primitives";
import { Section } from "@/components/section";
import { GithubContributionsGraph } from "@/components/activity/github-graphs";
import { Button } from "@heroui/react";
import { BentoBox, BentoGrid, BentoSizes } from "@/components/bento";
import {
   Bento as DiscordBento,
   label as discordLabel,
   size as discordSize,
} from "@/components/activity/boxes/discord";
import { BoxType } from "@/components/activity/boxes";

export default function AboutPage() {
   const bentos = [
      [DiscordBento, { label: discordLabel, size: discordSize }],
   ] as BoxType[];
   return (
      <Section
         id="activity"
         title="Activity"
         icon="Activity"
         className="mt-20 justify-items-center items-center"
      >
         <BentoGrid
            name="activity-bento"
            items={bentos.map(([_, { label }]) => label)}
            className="min-h-screen"
         >
            {bentos.map(([Bento, { label }]) => {
               return <Bento key={label} />;
            })}
         </BentoGrid>
      </Section>
   );
}
