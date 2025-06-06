export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  userId: number;
  tags: string[] | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  tags?: string[];
}
