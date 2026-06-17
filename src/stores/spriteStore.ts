import { create } from 'zustand';

export interface BlockInstance {
  id: string;
  opcode: string;
  x: number;
  y: number;
  nextId?: string;
  parentId?: string;
  inputs: Record<string, string | number | boolean>;
}

export interface Sprite {
  id: string;
  name: string;
  isStage: boolean;
  x: number;
  y: number;
  size: number;
  direction: number;
  visible: boolean;
  rotationStyle: 'all around' | 'left-right' | 'don\'t rotate';
  draggable: boolean;
  costumes: any[];
  currentCostume: number;
  sounds: any[];
  blocks: Record<string, BlockInstance>;
  variables: Record<string, any>;
  lists: Record<string, any[]>;
}

interface SpriteState {
  sprites: Sprite[];
  selectedSpriteId: string | null;
  addSprite: (sprite: Sprite) => void;
  updateSprite: (id: string, partial: Partial<Sprite>) => void;
  removeSprite: (id: string) => void;
  selectSprite: (id: string) => void;
  addBlock: (spriteId: string, block: BlockInstance) => void;
  updateBlock: (spriteId: string, blockId: string, partial: Partial<BlockInstance>) => void;
  removeBlock: (spriteId: string, blockId: string) => void;
}

export const useSpriteStore = create<SpriteState>((set) => ({
  sprites: [
    {
      id: 'stage',
      name: 'Stage',
      isStage: true,
      x: 0,
      y: 0,
      size: 100,
      direction: 90,
      visible: true,
      rotationStyle: 'all around',
      draggable: false,
      costumes: [{ id: 'backdrop1', name: 'backdrop1', url: '', width: 480, height: 360, backdropPattern: 'sky', backdropColors: ['#87CEEB', '#E0F7FA'] }],
      currentCostume: 0,
      sounds: [],
      blocks: {},
      variables: {},
      lists: {},
    },
    {
      id: 'sprite1',
      name: 'Sprite1',
      isStage: false,
      x: 0,
      y: 0,
      size: 100,
      direction: 90,
      visible: true,
      rotationStyle: 'all around',
      draggable: false,
      costumes: [{ id: 'costume1', name: 'costume1', url: '', width: 100, height: 100, svgShape: 'cat', svgColor: '#FF8C42' }],
      currentCostume: 0,
      sounds: [],
      blocks: {},
      variables: {},
      lists: {},
    },
  ],
  selectedSpriteId: 'sprite1',
  addSprite: (sprite) => set((state) => ({ sprites: [...state.sprites, sprite] })),
  updateSprite: (id, partial) =>
    set((state) => ({
      sprites: state.sprites.map((s) => (s.id === id ? { ...s, ...partial } : s)),
    })),
  removeSprite: (id) =>
    set((state) => ({
      sprites: state.sprites.filter((s) => s.id !== id),
      selectedSpriteId: state.selectedSpriteId === id ? state.sprites[0]?.id || null : state.selectedSpriteId,
    })),
  selectSprite: (id) => set({ selectedSpriteId: id }),
  addBlock: (spriteId, block) =>
    set((state) => ({
      sprites: state.sprites.map((s) =>
        s.id === spriteId ? { ...s, blocks: { ...s.blocks, [block.id]: block } } : s
      ),
    })),
  updateBlock: (spriteId, blockId, partial) =>
    set((state) => ({
      sprites: state.sprites.map((s) =>
        s.id === spriteId
          ? {
              ...s,
              blocks: {
                ...s.blocks,
                [blockId]: { ...s.blocks[blockId], ...partial },
              },
            }
          : s
      ),
    })),
  removeBlock: (spriteId, blockId) =>
    set((state) => ({
      sprites: state.sprites.map((s) => {
        if (s.id !== spriteId) return s;
        const newBlocks = { ...s.blocks };
        delete newBlocks[blockId];
        return { ...s, blocks: newBlocks };
      }),
    })),
}));
