import { InterviewSessionClient } from '@/components/interview-session';

export default function InterviewSessionPage({ params }: { params: { sessionId: string } }) {
  return <InterviewSessionClient sessionId={params.sessionId} />;
}
