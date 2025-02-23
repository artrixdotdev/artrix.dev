import { getContributions } from "@/lib/github";
import { title } from "@/components/primitives";
import { Section } from "@/components/section";
import { GithubContributionsGraph } from "@/components/activity/github-graphs";
import { Button } from "@heroui/react";
import { BentoBox, BentoGrid, BentoSizes } from "@/components/bento";
import { DiscordBento } from "@/components/activity/boxes/discord";
import { Suspense } from "react";

export default async function AboutPage() {
   const bentos = [DiscordBento];
   console.log(bentos.map(([Bento, { label }]) => <Bento key={label} />));
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
            {bentos.map(([Bento, { label }]) => (
               <Bento key={label} />
            ))}
         </BentoGrid>
      </Section>
   );
}
