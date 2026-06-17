import { create } from 'zustand';

export interface ProjectMeta {
  name: string;
  description: string;
  createdAt: number;
  modifiedAt: number;
}

interface ProjectState {
  project: ProjectMeta;
  isPlaying: boolean;
  language: 'en' | 'mr';
  
  setProjectName: (name: string) => void;
  setIsPlaying: (playing: boolean) => void;
  toggleLanguage: () => void;
  resetProject: () => void;
}

const defaultProject: ProjectMeta = {
  name: 'Untitled Project',
  description: '',
  createdAt: Date.now(),
  modifiedAt: Date.now(),
};

export const useProjectStore = create<ProjectState>((set) => ({
  project: { ...defaultProject },
  isPlaying: false,
  language: (localStorage.getItem('codexa_lang') as 'en' | 'mr') || 'en',

  setProjectName: (name) =>
    set((s) => ({ project: { ...s.project, name, modifiedAt: Date.now() } })),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  toggleLanguage: () => set((state) => {
    const newLang = state.language === 'en' ? 'mr' : 'en';
    localStorage.setItem('codexa_lang', newLang);
    return { language: newLang };
  }),

  resetProject: () =>
    set({
      project: { ...defaultProject, createdAt: Date.now(), modifiedAt: Date.now() },
      isPlaying: false,
    }),
}));
