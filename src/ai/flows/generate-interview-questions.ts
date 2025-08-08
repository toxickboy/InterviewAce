'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating interview questions.
 *
 * - generateInterviewQuestions - A function that generates interview questions.
 * - GenerateInterviewQuestionsInput - The input type for the generateInterviewQuestions function.
 * - GenerateInterviewQuestionsOutput - The return type for the generateInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewQuestionsInputSchema = z.object({
  jobRole: z.string().describe('The job role to generate interview questions for.'),
});
export type GenerateInterviewQuestionsInput = z.infer<typeof GenerateInterviewQuestionsInputSchema>;

const GenerateInterviewQuestionsOutputSchema = z.object({
  hrQuestions: z.array(z.string()).describe('An array of 5 HR interview questions.'),
  technicalQuestions: z.array(z.string()).describe('An array of 5 technical interview questions.'),
  behavioralQuestions: z.array(z.string()).describe('An array of 5 behavioral interview questions.'),
  aptitudeQuestions: z.array(z.string()).describe('An array of 5 aptitude questions.'),
});
export type GenerateInterviewQuestionsOutput = z.infer<typeof GenerateInterviewQuestionsOutputSchema>;

export async function generateInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {schema: GenerateInterviewQuestionsOutputSchema},
  prompt: `You are an AI assistant designed to generate interview questions for a given job role.

  Generate a diverse set of 5 HR, 5 technical, 5 behavioral, and 5 aptitude questions suitable for the role. The questions should be highly relevant to the specified job role.

  Job Role: {{{jobRole}}}

  Format the output as a JSON object with four keys: hrQuestions, technicalQuestions, behavioralQuestions, and aptitudeQuestions. Each key should contain an array of strings representing the corresponding questions.
  `,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
