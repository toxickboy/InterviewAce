import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-answer-and-provide-feedback.ts';
import '@/ai/flows/generate-resume-based-questions.ts';
import '@/ai/flows/generate-interview-questions.ts';
import '@/ai/flows/text-to-speech.ts';
