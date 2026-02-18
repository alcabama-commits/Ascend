
export interface Student {
  id: string;
  name: string;
  project: string;
  grades: Record<string, number>; // subjectId -> score
  participationBonus?: number;
  aiFeedback?: string;
}

export interface Subject {
  id: string;
  name: string;
}
