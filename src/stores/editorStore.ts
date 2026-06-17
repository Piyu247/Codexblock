import { create } from 'zustand';

export type EditorTab = 'code' | 'costumes' | 'sounds';

interface EditorState {
  /** Zoom level for the workspace (1 = 100%) */
  workspaceZoom: number;
  /** Currently selected block category */
  selectedCategory: string;
  /** Whether the sprite properties panel is expanded */
  spritePropsExpanded: boolean;
  /** Active left-panel tab */
  activeTab: EditorTab;
  /** Whether the sprite library modal is open */
  spriteLibraryOpen: boolean;
  /** Whether the backdrop library modal is open */
  backdropLibraryOpen: boolean;

  setWorkspaceZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setSelectedCategory: (cat: string) => void;
  setSpritePropsExpanded: (expanded: boolean) => void;
  setActiveTab: (tab: EditorTab) => void;
  setSpriteLibraryOpen: (open: boolean) => void;
  setBackdropLibraryOpen: (open: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  workspaceZoom: 0.7,
  selectedCategory: 'motion',
  spritePropsExpanded: true,
  activeTab: 'code',
  spriteLibraryOpen: false,
  backdropLibraryOpen: false,

  setWorkspaceZoom: (zoom) => set({ workspaceZoom: Math.max(0.25, Math.min(3, zoom)) }),
  zoomIn: () => set((s) => ({ workspaceZoom: Math.min(3, s.workspaceZoom + 0.1) })),
  zoomOut: () => set((s) => ({ workspaceZoom: Math.max(0.25, s.workspaceZoom - 0.1) })),
  resetZoom: () => set({ workspaceZoom: 0.7 }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSpritePropsExpanded: (expanded) => set({ spritePropsExpanded: expanded }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSpriteLibraryOpen: (open) => set({ spriteLibraryOpen: open }),
  setBackdropLibraryOpen: (open) => set({ backdropLibraryOpen: open }),
}));
