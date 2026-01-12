export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'error';
export interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  strategy?: Strategy;
}

export interface Strategy {
  goal: string;
  targetAudience: string;
  keyMilestones: string[];
  suggestedTools: string[];
  potentialRisks: string[];
}

export interface IdeaCardProps {
    idea: Idea;
    onDelete: (id: string) => void;
  }