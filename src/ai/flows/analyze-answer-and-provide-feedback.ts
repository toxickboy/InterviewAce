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
  feedback: z.string().describe("Detailed feedback on the user's answer, focusing on the STAR method (Situation, Task, Action, Result)."),
  score: z.number().describe('A score representing the quality of the answer (0-100), based on clarity, relevance, and structure.'),
  grammarFeedback: z.string().describe('Specific feedback on the grammar, syntax, and clarity of the answer.'),
  keywordFeedback: z.string().describe('Feedback on the use of relevant keywords and suggestions for improvement.'),
});
export type AnalyzeAnswerOutput = z.infer<typeof AnalyzeAnswerOutputSchema>;

export async function analyzeAnswerAndProvideFeedback(input: AnalyzeAnswerInput): Promise<AnalyzeAnswerOutput> {
  return analyzeAnswerAndProvideFeedbackFlow(input);
}

const analyzeAnswerAndProvideFeedbackPrompt = ai.definePrompt({
  name: 'analyzeAnswerAndProvideFeedbackPrompt',
  input: {schema: AnalyzeAnswerInputSchema},
  output: {schema: AnalyzeAnswerOutputSchema},
  prompt: `You are an AI interview coach. Your task is to provide detailed feedback on a user's answer to an interview question.

  **Instructions:**
  1.  **Analyze the Answer:** Carefully evaluate the user's answer based on the provided question and their resume (if available).
  2.  **Provide STAR Method Feedback:** Structure your main feedback around the STAR method (Situation, Task, Action, Result). Assess if the user clearly described all four components.
  3.  **Score the Answer:** Assign a score from 0 to 100 based on the following criteria:
      *   **Clarity & Conciseness:** How clear and to-the-point was the answer?
      *   **Relevance:** How relevant was the answer to the question?
      *   **Structure (STAR):** How well was the answer structured?
      *   **Impact:** Did the user effectively communicate the impact of their actions?
  4.  **Grammar & Keywords:** Provide specific feedback on grammar and suggest relevant keywords the user could have included.
  5.  **Format Output:** Ensure your response is a valid JSON object that strictly conforms to the defined output schema.

  **Interview Details:**
  - **Question:** {{{question}}}
  - **User's Answer:** {{{answer}}}
  {{#if resume}}
  - **User's Resume:** 
  \`\`\`
  {{{resume}}}
  \`\`\`
  {{/if}}
  `,
});

const analyzeAnswerAndProvideFeedbackFlow = ai.defineFlow({
  name: 'analyzeAnswerAndProvideFeedbackFlow',
  inputSchema: AnalyzeAnswerInputSchema,
  outputSchema: AnalyzeAnswerOutputSchema,
}, async (input) => {
  const {output} = await analyzeAnswerAndProvideFeedbackPrompt(input);
  return output!;
});
