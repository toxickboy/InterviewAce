// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Generates interview questions based on an uploaded resume.
 *
 * - generateResumeBasedQuestions - A function that generates interview questions based on a resume.
 * - GenerateResumeBasedQuestionsInput - The input type for the generateResumeBasedQuestions function.
 * - GenerateResumeBasedQuestionsOutput - The return type for the generateResumeBasedQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeBasedQuestionsInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to generate questions from.'),
});
export type GenerateResumeBasedQuestionsInput = z.infer<
  typeof GenerateResumeBasedQuestionsInputSchema
>;

const GenerateResumeBasedQuestionsOutputSchema = z.object({
  questions: z
    .array(z.string())
    .describe('An array of interview questions based on the resume.'),
});
export type GenerateResumeBasedQuestionsOutput = z.infer<
  typeof GenerateResumeBasedQuestionsOutputSchema
>;

export async function generateResumeBasedQuestions(
  input: GenerateResumeBasedQuestionsInput
): Promise<GenerateResumeBasedQuestionsOutput> {
  return generateResumeBasedQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumeBasedQuestionsPrompt',
  input: {schema: GenerateResumeBasedQuestionsInputSchema},
  output: {schema: GenerateResumeBasedQuestionsOutputSchema},
  prompt: `You are an expert career coach specializing in helping people prepare for job interviews.  You will be provided with the text from their resume, and your job is to generate a list of potential interview questions that a hiring manager might ask, based on the content of the resume.

Resume:
{{resumeText}}

Questions:`,
});

const generateResumeBasedQuestionsFlow = ai.defineFlow(
  {
    name: 'generateResumeBasedQuestionsFlow',
    inputSchema: GenerateResumeBasedQuestionsInputSchema,
    outputSchema: GenerateResumeBasedQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
