'use server';
/**
 * @fileOverview An AI agent that analyzes plant health based on an image and description.
 *
 * - analyzePlantHealth - A function that analyzes the plant health.
 * - AnalyzePlantHealthInput - The input type for the analyzePlantHealth function.
 * - AnalyzePlantHealthOutput - The return type for the analyzePlantHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePlantHealthInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  plantDescription: z.string().describe('The description of the plant.'),
  locale: z.enum(['en', 'ar']).default('en').describe('The locale for the analysis.'),
});
export type AnalyzePlantHealthInput = z.infer<typeof AnalyzePlantHealthInputSchema>;

const AnalyzePlantHealthOutputSchema = z.object({
  healthStatus: z.enum(['healthy', 'sick']).describe('The health status of the plant.'),
  disease: z.string().optional().describe('The likely disease affecting the plant, if any.'),
  treatmentAdvice: z.string().optional().describe('Advice on how to treat the disease, if applicable.'),
  confidenceLevel: z.number().describe('A confidence level between 0 and 1 indicating the accuracy of the analysis.'),
});
export type AnalyzePlantHealthOutput = z.infer<typeof AnalyzePlantHealthOutputSchema>;

export async function analyzePlantHealth(input: AnalyzePlantHealthInput): Promise<AnalyzePlantHealthOutput> {
  return analyzePlantHealthFlow(input);
}

const analyzePlantHealthPrompt = ai.definePrompt({
  name: 'analyzePlantHealthPrompt',
  input: {schema: AnalyzePlantHealthInputSchema},
  output: {schema: AnalyzePlantHealthOutputSchema},
  prompt: `You are an expert in plant health and disease diagnosis. Analyze the provided information to determine the health status of the plant and provide treatment advice if necessary.

  Description: {{{plantDescription}}}
  Photo: {{media url=photoDataUri}}
  Locale: {{{locale}}}

  Based on the image and description, determine if the plant is healthy or sick. If sick, identify the likely disease and provide treatment advice. Also, provide a confidence level for your analysis between 0 and 1.

  IMPORTANT: Your entire response, including the disease name (the 'disease' field), treatment advice (the 'treatmentAdvice' field), and all other textual fields in the output schema, MUST be in the language specified by the 'locale' input parameter. For example, if 'locale' is 'ar' (Arabic), then a disease like "Early blight" must be translated to its Arabic equivalent (e.g., "اللفحة المبكرة"), and all associated advice must also be in Arabic. Adhere strictly to the locale for all generated text.
  `,
});

const analyzePlantHealthFlow = ai.defineFlow(
  {
    name: 'analyzePlantHealthFlow',
    inputSchema: AnalyzePlantHealthInputSchema,
    outputSchema: AnalyzePlantHealthOutputSchema,
  },
  async input => {
    const {output} = await analyzePlantHealthPrompt(input);
    return output!;
  }
);
