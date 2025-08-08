'use server';

import { analyzeAnswerAndProvideFeedback } from '@/ai/flows/analyze-answer-and-provide-feedback';
import type { AnalyzeAnswerInput } from '@/ai/flows/analyze-answer-and-provide-feedback';
import { generateInterviewQuestions } from '@/ai/flows/generate-interview-questions';
import type { GenerateInterviewQuestionsInput } from '@/ai/flows/generate-interview-questions';
import { generateResumeBasedQuestions } from '@/ai/flows/generate-resume-based-questions';
import type { GenerateResumeBasedQuestionsInput } from '@/ai/flows/generate-resume-based-questions';
import {z} from 'zod';
import Razorpay from 'razorpay';
import { randomBytes } from 'crypto';
import type { UserTier } from './types';

const generateQuestionsInputSchema = z.object({
    jobRole: z.string(),
    questionCount: z.number(),
});
export async function generateQuestionsAction(
  input: GenerateInterviewQuestionsInput
) {
  generateQuestionsInputSchema.parse(input);
  return await generateInterviewQuestions(input);
}

const generateResumeQuestionsInputSchema = z.object({
    resumeText: z.string(),
    questionCount: z.number(),
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
    userTier: z.enum(['free', 'premium']),
});
export async function analyzeAnswerAction(input: AnalyzeAnswerInput) {
    analyzeAnswerInputSchema.parse(input);
  return await analyzeAnswerAndProvideFeedback(input);
}

const createOrderInputSchema = z.object({
    amount: z.number().positive(),
});

export async function createRazorpayOrder(amount: number) {
    createOrderInputSchema.parse({ amount });

    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: `receipt_${randomBytes(4).toString('hex')}`,
        };

        const order = await instance.orders.create(options);
        return order;
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        throw new Error("Could not create payment order. Please try again later.");
    }
}
