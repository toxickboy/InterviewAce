import type { AnalyzeAnswerOutput } from '@/ai/flows/analyze-answer-and-provide-feedback';

export type QuestionType = 'hr' | 'technical' | 'behavioral' | 'resume';

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
  resumeText?: string;
  questions: Question[];
  currentQuestionIndex: number;
  createdAt: string; // ISO string
  status: 'in-progress' | 'completed';
}
