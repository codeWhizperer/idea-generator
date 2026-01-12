'use client';

import { useState, useCallback } from 'react';

export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'error';

export function useIdeaGenerator() {
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (title?: string, description?: string, tags?: string[]) => {
    setStatus('generating');
    setOutput('');
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, tags }),
      });

      if (!res.ok || !res.body) throw new Error('Failed to generate idea');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let raw = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += decoder.decode(value);
        setOutput(raw); // incremental display
      }

      setStatus('completed');
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong');
      setStatus('error');
    }
  }, []);

  return {
    generate,
    status,
    output,
    error,
    isGenerating: status === 'generating',
  };
}
