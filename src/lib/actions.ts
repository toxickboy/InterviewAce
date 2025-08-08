'use server';

import { analyzeAnswerAndProvideFeedback } from '@/ai/flows/analyze-answer-and-provide-feedback';
import type { AnalyzeAnswerInput } from '@/ai/flows/analyze-answer-and-provide-feedback';
import { generateInterviewQuestions } from '@/ai/flows/generate-interview-questions';
import type { GenerateInterviewQuestionsInput } from '@/ai/flows/generate-interview-questions';
import { generateResumeBasedQuestions } from '@/ai/flows/generate-resume-based-questions';
import type { GenerateResumeBasedQuestionsInput } from '@/ai/flows/generate-resume-based-questions';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import type { TextToSpeechInput } from '@/ai/flows/text-to-speech';
import {z} from 'zod';

const generateQuestionsInputSchema = z.object({
    jobRole: z.string(),
});
export async function generateQuestionsAction(
  input: GenerateInterviewQuestionsInput
) {
  generateQuestionsInputSchema.parse(input);
  return await generateInterviewQuestions(input);
}

const generateResumeQuestionsInputSchema = z.object({
    resumeText: z.string(),
});
export async function generateResumeQuestionsAction(
  input: GenerateResumeBasedQuestionsInput
) {
    generateResumeQuestionsInputSchema.parse(input);
  return await generateResumeBasedQuestions(input);
}

const analyzeAnswerInputSchema = z.object({
    question: z.string(),
    answer: z.string(),
    resume: z.string().optional(),
});
export async function analyzeAnswerAction(input: AnalyzeAnswerInput) {
    analyzeAnswerInputSchema.parse(input);
  return await analyzeAnswerAndProvideFeedback(input);
}

const textToSpeechInputSchema = z.object({
    text: z.string(),
    voice: z.enum(['male', 'female', 'none']),
});
export async function textToSpeechAction(input: TextToSpeechInput) {
    textToSpeechInputSchema.parse(input);
    if (input.voice === 'none') {
        return '';
    }
    const { audioDataUri } = await textToSpeech(input);
    return audioDataUri;
}
