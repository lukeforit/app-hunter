import React from 'react';
import { Sparkles } from 'lucide-react';

export const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-zinc-800 rounded-3xl space-y-4">
    <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
      <Sparkles className="w-8 h-8 text-zinc-600" />
    </div>
    <div>
      <h3 className="text-lg font-semibold">Your hunt is quiet...</h3>
      <p className="text-zinc-500 text-sm max-w-xs mx-auto">Use Magic Paste to automatically track your next big move.</p>
    </div>
  </div>
);
