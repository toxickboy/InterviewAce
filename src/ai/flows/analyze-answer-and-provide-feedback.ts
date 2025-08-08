'use server';
/**
 * @fileOverview This file contains the Genkit flow for analyzing user answers and providing feedback.
 *
 * - analyzeAnswerAndProvideFeedback - A function that handles the answer analysis and feedback process.
 * - AnalyzeAnswerInput - The input type for the analyzeAnswerAndProvideFeedback function.
 * - AnalyzeAnswerOutput - The return type for the analyzeAnswerAndProvideFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAnswerInputSchema = z.object({
  question: z.string().describe('The interview question asked.'),
  answer: z.string().describe("The user's answer to the question."),
  resume: z.string().optional().describe("The user's resume, if available."),
});
export type AnalyzeAnswerInput = z.infer<typeof AnalyzeAnswerInputSchema>;

const AnalyzeAnswerOutputSchema = z.object({
  feedback: z.string().describe("Detailed feedback on the user's answer."),
  score: z.number().describe('A score representing the quality of the answer (0-100).'),
  grammarFeedback: z.string().describe('Feedback on the grammar of the answer.'),
  keywordFeedback: z.string().describe('Feedback on the keywords used in the answer.'),
});
export type AnalyzeAnswerOutput = z.infer<typeof AnalyzeAnswerOutputSchema>;

export async function analyzeAnswerAndProvideFeedback(input: AnalyzeAnswerInput): Promise<AnalyzeAnswerOutput> {
  return analyzeAnswerAndProvideFeedbackFlow(input);
}

const analyzeAnswerAndProvideFeedbackPrompt = ai.definePrompt({
  name: 'analyzeAnswerAndProvideFeedbackPrompt',
  input: {schema: AnalyzeAnswerInputSchema},
  output: {schema: AnalyzeAnswerOutputSchema},
  prompt: `You are an AI interview coach providing feedback on interview answers.

  Evaluate the following answer to the question based on clarity, relevance, grammar, and use of keywords.
  Provide a score between 0 and 100.

  Question: {{{question}}}
  Answer: {{{answer}}}

  ${'{{#if resume}}'}Consider the following resume when providing feedback: {{{resume}}}{{'{{/if}}'}}

  Provide feedback on the grammar of the answer. Identify missing keywords that are relevant to the question.
  
  Format your response as a JSON object that conforms to the output schema.`,
});

const analyzeAnswerAndProvideFeedbackFlow = ai.defineFlow({
  name: 'analyzeAnswerAndProvideFeedbackFlow',
  inputSchema: AnalyzeAnswerInputSchema,
  outputSchema: AnalyzeAnswerOutputSchema,
}, async (input) => {
  const {output} = await analyzeAnswerAndProvideFeedbackPrompt(input);
  return output!;
});
