export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  meeting?: string;
  starred: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteFormData {
  title: string;
  content: string;
  tags: string[];
  meeting?: string;
  starred: boolean;
}