import { useProjectStore } from '../stores/projectStore';
import { useSpriteStore, type Sprite, type BlockInstance } from '../stores/spriteStore';

interface ThreadState {
  spriteId: string;
  blockId: string;
  loopStack: { blockId: string; iterationsLeft: number; startBlockId?: string }[];
}

class ExecutionEngine {
  private runningThreads: ThreadState[] = [];
  private intervalId: number | null = null;
  private fps: number = 30;

  start() {
    console.log('Engine starting...');
    if (this.intervalId) return;

    this.runningThreads = [];
    const { sprites } = useSpriteStore.getState();
    for (const sprite of sprites) {
      for (const block of Object.values(sprite.blocks)) {
        if (block.opcode === 'event_whenflagclicked') {
          this.runningThreads.push({
            spriteId: sprite.id,
            blockId: block.id,
            loopStack: [],
          });
        }
      }
    }

    this.intervalId = window.setInterval(() => this.tick(), 1000 / this.fps);
  }

  stop() {
    console.log('Engine stopping...');
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.runningThreads = [];
  }

  private tick() {
    const { isPlaying } = useProjectStore.getState();
    if (!isPlaying) {
      this.stop();
      return;
    }

    const { sprites, updateSprite } = useSpriteStore.getState();
    const activeThreads: ThreadState[] = [];

    for (const thread of this.runningThreads) {
      const sprite = sprites.find((s) => s.id === thread.spriteId);
      if (!sprite) continue;

      const block = sprite.blocks[thread.blockId];
      if (!block) {
        // If block is missing, maybe pop loop stack
        if (thread.loopStack.length > 0) {
          const loop = thread.loopStack[thread.loopStack.length - 1];
          loop.iterationsLeft--;
          if (loop.iterationsLeft > 0 && loop.startBlockId) {
            activeThreads.push({ ...thread, blockId: loop.startBlockId });
          } else {
            thread.loopStack.pop();
            const parentLoopBlock = sprite.blocks[loop.blockId];
            if (parentLoopBlock?.nextId) {
              activeThreads.push({ ...thread, blockId: parentLoopBlock.nextId });
            }
          }
        }
        continue;
      }

      const nextBlockId = this.executeBlock(sprite, block, thread, updateSprite);

      if (nextBlockId) {
        activeThreads.push({ ...thread, blockId: nextBlockId });
      } else if (thread.loopStack.length > 0) {
        // Reached end of a nested block, pop loop stack
        const loop = thread.loopStack[thread.loopStack.length - 1];
        loop.iterationsLeft--;
        if (loop.iterationsLeft > 0 && loop.startBlockId) {
          activeThreads.push({ ...thread, blockId: loop.startBlockId });
        } else {
          thread.loopStack.pop();
          const parentLoopBlock = sprite.blocks[loop.blockId];
          if (parentLoopBlock?.nextId) {
            activeThreads.push({ ...thread, blockId: parentLoopBlock.nextId });
          }
        }
      }
    }

    this.runningThreads = activeThreads;
    if (this.runningThreads.length === 0) {
      useProjectStore.getState().setIsPlaying(false);
      this.stop();
    }
  }

  private executeBlock(
    sprite: Sprite,
    block: BlockInstance,
    thread: ThreadState,
    updateSprite: (id: string, p: Partial<Sprite>) => void
  ): string | undefined {
    switch (block.opcode) {
      case 'event_whenflagclicked':
        break;

      case 'motion_movesteps':
        {
          const steps = Number(block.inputs['NUM'] ?? 10);
          const rad = ((sprite.direction - 90) * Math.PI) / 180;
          updateSprite(sprite.id, {
            x: sprite.x + Math.cos(rad) * steps,
            y: sprite.y - Math.sin(rad) * steps,
          });
        }
        break;

      case 'motion_turnright':
        {
          const degrees = Number(block.inputs['NUM'] ?? 15);
          updateSprite(sprite.id, { direction: (sprite.direction + degrees) % 360 });
        }
        break;

      case 'motion_turnleft':
        {
          const degrees = Number(block.inputs['NUM'] ?? 15);
          updateSprite(sprite.id, { direction: (sprite.direction - degrees) % 360 });
        }
        break;

      case 'looks_say':
        {
          const msg = String(block.inputs['TEXT'] ?? 'Hello!');
          console.log(`${sprite.name} says: ${msg}`);
          // You could dispatch this to a toast or store it on the sprite to render a speech bubble
        }
        break;

      case 'looks_show':
        updateSprite(sprite.id, { visible: true });
        break;

      case 'looks_hide':
        updateSprite(sprite.id, { visible: false });
        break;

      case 'looks_switchcostumeto':
        {
          const costumeName = String(block.inputs['DROPDOWN'] ?? 'costume1');
          const idx = sprite.costumes.findIndex((c) => c.name === costumeName || c.id === costumeName);
          if (idx !== -1) {
            updateSprite(sprite.id, { currentCostume: idx });
          }
        }
        break;

      case 'looks_nextcostume':
        updateSprite(sprite.id, { currentCostume: (sprite.currentCostume + 1) % sprite.costumes.length });
        break;

      case 'looks_switchbackdropto':
        {
          const backdropName = String(block.inputs['DROPDOWN'] ?? 'backdrop1');
          const stage = useSpriteStore.getState().sprites.find((s) => s.isStage);
          if (stage) {
            const idx = stage.costumes.findIndex((c) => c.name === backdropName || c.id === backdropName);
            if (idx !== -1) {
              updateSprite(stage.id, { currentCostume: idx });
            }
          }
        }
        break;

      case 'looks_nextbackdrop':
        {
          const stage = useSpriteStore.getState().sprites.find((s) => s.isStage);
          if (stage) {
            updateSprite(stage.id, { currentCostume: (stage.currentCostume + 1) % stage.costumes.length });
          }
        }
        break;

      case 'looks_changesizeby':
        {
          const amount = Number(block.inputs['NUM'] ?? 10);
          updateSprite(sprite.id, { size: Math.max(5, sprite.size + amount) });
        }
        break;

      case 'looks_setsizeto':
        {
          const size = Number(block.inputs['NUM'] ?? 100);
          updateSprite(sprite.id, { size: Math.max(5, size) });
        }
        break;

      case 'motion_gotoxy':
        {
          const x = Number(block.inputs['X'] ?? 0);
          const y = Number(block.inputs['Y'] ?? 0);
          updateSprite(sprite.id, { x, y });
        }
        break;

      case 'motion_changexby':
        {
          const dx = Number(block.inputs['NUM'] ?? 10);
          updateSprite(sprite.id, { x: sprite.x + dx });
        }
        break;

      case 'motion_setx':
        {
          const x = Number(block.inputs['NUM'] ?? 0);
          updateSprite(sprite.id, { x });
        }
        break;

      case 'motion_changeyby':
        {
          const dy = Number(block.inputs['NUM'] ?? 10);
          updateSprite(sprite.id, { y: sprite.y + dy });
        }
        break;

      case 'motion_sety':
        {
          const y = Number(block.inputs['NUM'] ?? 0);
          updateSprite(sprite.id, { y });
        }
        break;

      case 'sound_play':
        {
          const soundName = String(block.inputs['DROPDOWN'] ?? 'Meow');
          console.log(`Playing sound: ${soundName}`);
          // Mock play sound
        }
        break;

      case 'control_repeat':
        {
          const times = Number(block.inputs['TIMES'] ?? 10);
          
          // In a real implementation we would have an AST where the mouth of the C-block
          // has a reference to its first child block.
          // For now, since we only snap linearly in the mock Workspace, we'll assume nextId is the body
          // and skip proper C-block nesting. To make this work properly, Workspace needs nested dropping.
          // Let's just mock it: if we have nextId, treat it as the loop body.
          if (times > 0 && block.nextId) {
            thread.loopStack.push({
              blockId: block.id,
              iterationsLeft: times,
              startBlockId: block.nextId,
            });
            return block.nextId;
          }
        }
        break;

      case 'control_wait':
        {
          // Wait mock: usually handled by pausing thread execution in async/yield
          console.log(`Waiting ${block.inputs['SECS']} seconds...`);
        }
        break;
    }

    // Skip returning nextId if it's handled by a loop above
    if (block.opcode === 'control_repeat') return undefined;
    return block.nextId;
  }
}

export const engine = new ExecutionEngine();
