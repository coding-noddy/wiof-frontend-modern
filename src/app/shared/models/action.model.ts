export interface ActionItem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeNeeded: string;
  impactScore: number;
  category: string;
  element: 'earth' | 'water' | 'fire' | 'air' | 'space';
  checklist: string[];
  resources?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'tool' | 'guide';
  }[];
  completedBy?: number;
}

export interface ActionProgress {
  actionId: string;
  completedSteps: number[];
  startedAt: string;
  completedAt?: string;
  pledged: boolean;
}
