// src/ai/flows/provide-plant-care-tips.ts
'use server';

/**
 * @fileOverview Provides general tips for maintaining plant health, categorized by plant type or problem.
 *
 * - providePlantCareTips - A function that provides plant care tips.
 * - ProvidePlantCareTipsInput - The input type for the providePlantCareTips function.
 * - ProvidePlantCareTipsOutput - The return type for the providePlantCareTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getCached, setCached } from '@/lib/apiCache';

const ProvidePlantCareTipsInputSchema = z.object({
  plantType: z
    .string()
    .optional()
    .describe('The type of plant for which care tips are needed.'),
  problem: z
    .string()
    .optional()
    .describe('The specific problem the plant is experiencing.'),
});

export type ProvidePlantCareTipsInput = z.infer<
  typeof ProvidePlantCareTipsInputSchema
>;

const ProvidePlantCareTipsOutputSchema = z.object({
  careTips: z
    .string()
    .describe('Detailed tips for maintaining the plant health.'),
});

export type ProvidePlantCareTipsOutput = z.infer<
  typeof ProvidePlantCareTipsOutputSchema
>;

export async function providePlantCareTips(
  input: ProvidePlantCareTipsInput
): Promise<ProvidePlantCareTipsOutput> {
  const cacheKey = {
    plantType: input.plantType || 'general',
    problem: input.problem || 'maintenance',
  };

  // Check cache first
  const cached = getCached<ProvidePlantCareTipsOutput>('plant-tips', cacheKey);
  if (cached) {
    console.log('Returning cached plant care tips');
    return cached;
  }

  const result = await providePlantCareTipsFlow(input);
  
  // Cache the result for 7 days (care tips don't change frequently)
  setCached('plant-tips', cacheKey, result, 7 * 24 * 60 * 60 * 1000);
  
  return result;
}

const prompt = ai.definePrompt({
  name: 'providePlantCareTipsPrompt',
  input: {schema: ProvidePlantCareTipsInputSchema},
  output: {schema: ProvidePlantCareTipsOutputSchema},
  prompt: `You are an expert horticulturalist. Provide detailed care tips for the plant, taking into account the plant type and any specific problems it may be experiencing.

{{#if plantType}}
Plant Type: {{{plantType}}}
{{/if}}

{{#if problem}}
Problem: {{{problem}}}
{{/if}}

Please provide detailed and actionable tips to ensure the plant thrives.`,
});

const providePlantCareTipsFlow = ai.defineFlow(
  {
    name: 'providePlantCareTipsFlow',
    inputSchema: ProvidePlantCareTipsInputSchema,
    outputSchema: ProvidePlantCareTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
