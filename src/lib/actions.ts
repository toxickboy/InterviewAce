'use server';

import { analyzeAnswerAndProvideFeedback } from '@/ai/flows/analyze-answer-and-provide-feedback';
import type { AnalyzeAnswerInput } from '@/ai/flows/analyze-answer-and-provide-feedback';
import { generateInterviewQuestions } from '@/ai/flows/generate-interview-questions';
import type { GenerateInterviewQuestionsInput } from '@/ai/flows/generate-interview-questions';
import { generateResumeBasedQuestions } from '@/ai/flows/generate-resume-based-questions';
import type { GenerateResumeBasedQuestionsInput } from '@/ai/flows/generate-resume-based-questions';
import {z} from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Cashfree } from 'cashfree-pg';

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
    userId: z.string(),
    userEmail: z.string().email(),
    userName: z.string(),
});

Cashfree.XClientId = process.env.CASHFREE_APP_ID!;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY!;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX; // Use .PRODUCTION for production

export async function createCashfreeOrder(input: z.infer<typeof createOrderInputSchema>) {
    createOrderInputSchema.parse(input);
    const { amount, userId, userEmail, userName } = input;
    const orderId = `order_${uuidv4()}`;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    // The URL where the user will be redirected after payment
    // Ensure this URL is whitelisted in your Cashfree dashboard
    const returnUrl = `${appUrl}/api/payment/verify?order_id={order_id}`;

    try {
        const request = {
            order_id: orderId,
            order_amount: amount,
            order_currency: "INR",
            customer_details: {
                customer_id: userId,
                customer_email: userEmail,
                customer_name: userName,
                customer_phone: "9999999999", // A dummy phone number is required
            },
            order_meta: {
                return_url: returnUrl,
            },
            order_note: `Premium subscription for InterviewAce`
        };

        const response = await Cashfree.PGCreateOrder("2023-08-01", request);
        return response; // Return the full response object
    } catch (error: any) {
        console.error("Error creating Cashfree order:", error.response.data);
        throw new Error("Could not create payment order. Please try again later.");
    }
}
