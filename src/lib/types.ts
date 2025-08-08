import type { AnalyzeAnswerOutput } from '@/ai/flows/analyze-answer-and-provide-feedback';

export type QuestionType = 'hr' | 'technical' | 'behavioral' | 'resume' | 'aptitude';
export type UserTier = 'free' | 'premium';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  answer?: string;
  feedback?: AnalyzeAnswerOutput;
}

export interface InterviewSession {
  id:string;
  jobRole: string;
  interviewType: 'full' | 'hr' | 'technical' | 'behavioral' | 'aptitude' | 'resume';
  resumeText?: string;
  questions: Question[];
  currentQuestionIndex: number;
  createdAt: string; // ISO string
  status: 'in-progress' | 'completed';
  userTier: UserTier;
}
