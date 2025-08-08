'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Send, Loader2, Bot, User, ThumbsUp, ThumbsDown, GraduationCap, Lightbulb, CheckCircle } from 'lucide-react';
import type { InterviewSession, Question } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { analyzeAnswerAction } from '@/lib/actions';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function InterviewSessionClient({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  useEffect(() => {
    try {
      const sessions: InterviewSession[] = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
      const currentSession = sessions.find(s => s.id === sessionId);
      if (currentSession) {
        setSession(currentSession);
      } else {
        toast({ title: 'Error', description: 'Interview session not found.', variant: 'destructive' });
        router.push('/');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not load session data.', variant: 'destructive' });
      router.push('/');
    }
  }, [sessionId, router, toast]);
  
  useEffect(() => {
    if (transcript) {
        setCurrentAnswer(prev => prev ? `${prev} ${transcript}` : transcript);
        resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const updateSessionInStorage = (updatedSession: InterviewSession) => {
    const sessions: InterviewSession[] = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex !== -1) {
      sessions[sessionIndex] = updatedSession;
      localStorage.setItem('interview_sessions', JSON.stringify(sessions));
    }
  };

  const handleAnswerSubmit = async () => {
    if (!session || currentAnswer.trim() === '') return;
    setIsAnalyzing(true);

    try {
      const currentQuestion = session.questions[session.currentQuestionIndex];
      const feedback = await analyzeAnswerAction({
        question: currentQuestion.text,
        answer: currentAnswer,
        resume: session.resumeText,
      });

      const updatedQuestion: Question = {
        ...currentQuestion,
        answer: currentAnswer,
        feedback: feedback,
      };

      const updatedQuestions = [...session.questions];
      updatedQuestions[session.currentQuestionIndex] = updatedQuestion;
      
      const updatedSession: InterviewSession = {
        ...session,
        questions: updatedQuestions,
      };
      
      setSession(updatedSession);
      updateSessionInStorage(updatedSession);
      setShowFeedback(true);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to analyze answer.', variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (showFeedback) {
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showFeedback]);

  const handleNextQuestion = () => {
    if (!session) return;
    setShowFeedback(false);
    setCurrentAnswer('');

    const nextIndex = session.currentQuestionIndex + 1;
    if (nextIndex < session.questions.length) {
      const updatedSession: InterviewSession = {
        ...session,
        currentQuestionIndex: nextIndex,
      };
      setSession(updatedSession);
      updateSessionInStorage(updatedSession);
    } else {
      // Interview complete
      const updatedSession: InterviewSession = {
        ...session,
        status: 'completed',
      };
      setSession(updatedSession);
      updateSessionInStorage(updatedSession);
    }
  };
  
  if (!session) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const isCompleted = session.status === 'completed';

  if (isCompleted) {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4"/>
            <h1 className="text-3xl font-headline font-bold text-primary mb-2">Interview Complete!</h1>
            <p className="text-muted-foreground mb-6 max-w-md">
                Congratulations on completing your mock interview. You can review your performance on the progress page.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => router.push('/progress')}>View Progress</Button>
                <Button variant="outline" onClick={() => router.push('/')}>Back to Dashboard</Button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/50">
        <div className="container mx-auto max-w-3xl py-8">
            <Progress value={(session.currentQuestionIndex / session.questions.length) * 100} className="mb-4" />
            <p className="text-center text-sm text-muted-foreground mb-8">
                Question {session.currentQuestionIndex + 1} of {session.questions.length}
            </p>

            <div className="space-y-6">
                <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Avatar className="h-10 w-10 border">
                        <AvatarFallback><Bot/></AvatarFallback>
                    </Avatar>
                    <Card className="flex-1">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle className="font-headline text-lg">Interviewer</CardTitle>
                            <Badge variant="outline" className="capitalize">{currentQuestion.type}</Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg">{currentQuestion.text}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person avatar" />
                        <AvatarFallback><User/></AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                        <Textarea 
                            placeholder="Type your answer here, or use the microphone to speak..."
                            value={currentAnswer}
                            onChange={(e) => setCurrentAnswer(e.target.value)}
                            className="min-h-[150px] text-base"
                            disabled={showFeedback}
                        />
                        <div className="flex items-center justify-between">
                            {hasRecognitionSupport ? (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={isListening ? stopListening : startListening}
                                    disabled={showFeedback}
                                    className={isListening ? 'text-destructive' : ''}
                                >
                                    {isListening ? <MicOff /> : <Mic />}
                                </Button>
                            ) : <div></div>}
                            <Button onClick={handleAnswerSubmit} disabled={isAnalyzing || showFeedback || currentAnswer.trim() === ''}>
                                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                Submit Answer
                            </Button>
                        </div>
                    </div>
                </div>

                {showFeedback && currentQuestion.feedback && (
                    <div ref={feedbackRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Alert variant="default" className="bg-accent/20 border-accent">
                        <Lightbulb className="h-4 w-4 text-accent-foreground" />
                        <AlertTitle className="font-headline text-accent-foreground">Feedback Analysis</AlertTitle>
                        <AlertDescription>
                            <div className="space-y-4 mt-2">
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2"><GraduationCap className="h-5 w-5"/> Overall Score</h3>
                                    <div className="flex items-center gap-4 mt-2">
                                        <Progress value={currentQuestion.feedback.score} className="h-3" />
                                        <span className="font-bold text-lg text-primary">{currentQuestion.feedback.score}/100</span>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2"><ThumbsUp className="h-5 w-5"/> Detailed Feedback</h3>
                                    <p className="text-muted-foreground mt-1">{currentQuestion.feedback.feedback}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2"><ThumbsUp className="h-5 w-5"/> Grammar Feedback</h3>
                                    <p className="text-muted-foreground mt-1">{currentQuestion.feedback.grammarFeedback}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2"><ThumbsDown className="h-5 w-5"/> Keyword Suggestions</h3>
                                    <p className="text-muted-foreground mt-1">{currentQuestion.feedback.keywordFeedback}</p>
                                </div>
                                <Button onClick={handleNextQuestion} className="w-full mt-4">
                                    {session.currentQuestionIndex === session.questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
