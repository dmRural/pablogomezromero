import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const features = defineCollection({
  loader: glob({ base: "./src/content/features", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string(),
    }),
});

export const collections = { features };
