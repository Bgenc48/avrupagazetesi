import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const SECTIONS = ['goc-ve-uyum', 'toplum', 'turkiye-avrupa', 'yasam', 'rehber'] as const;

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().min(20).max(120),
    deck: z.string().min(40).max(220),
    section: z.enum(SECTIONS),
    author: z.string(),
    authorTitle: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    heroCredit: z.string().optional(),
    heroCreditUrl: z.url().optional(),
    photoQuery: z.string().optional(),
    excerpt: z.string().min(40).max(220),
    tags: z.array(z.string()).min(2),
    featured: z.boolean().default(false),
    lead: z.boolean().default(false),
    lang: z.enum(['tr']).default('tr'),
    advisory: z.boolean().default(false),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  }),
});

export const collections = { articles };
