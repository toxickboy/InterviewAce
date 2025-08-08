import { BotMessageSquare } from 'lucide-react';
import React from 'react';

export function Logo() {
  return (
    <div className="bg-primary text-primary-foreground p-2 rounded-md">
      <BotMessageSquare className="h-6 w-6" />
    </div>
  );
}
