import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useEditorStore } from '../stores/editorStore';
import { useSpriteStore, type BlockInstance } from '../stores/spriteStore';
import { getCategoryForBlock, getBlockDef } from '../blocks/blockDefinitions';
import BlockRenderer from './BlockRenderer';
import type { BlockDef } from '../blocks/blockDefinitions';

interface ContextMenuState {
  x: number;
  y: number;
  blockId: string;
}

interface UndoEntry {
  blocks: Record<string, BlockInstance>;
}

export default function Workspace() {
  const { workspaceZoom, zoomIn, zoomOut, resetZoom, activeTab } = useEditorStore();
  const { selectedSpriteId, sprites, addBlock, updateBlock, removeBlock } = useSpriteStore();
  const selectedSprite = sprites.find((s) => s.id === selectedSpriteId);

  const canvasRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [dragBlockId, setDragBlockId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [snapHighlight, setSnapHighlight] = useState<{ x: number; y: number } | null>(null);

  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [redoStack, setRedoStack] = useState<UndoEntry[]>([]);

  const pushUndo = useCallback(() => {
    if (!selectedSprite) return;
    setUndoStack((prev) => [...prev.slice(-30), { blocks: { ...selectedSprite.blocks } }]);
    setRedoStack([]);
  }, [selectedSprite]);

  const handleUndo = useCallback(() => {
    if (!selectedSpriteId || undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    const currentBlocks = selectedSprite?.blocks ?? {};
    setRedoStack((r) => [...r, { blocks: { ...currentBlocks } }]);
    setUndoStack((u) => u.slice(0, -1));
    useSpriteStore.getState().updateSprite(selectedSpriteId, { blocks: prev.blocks });
  }, [selectedSpriteId, selectedSprite, undoStack]);

  const handleRedo = useCallback(() => {
    if (!selectedSpriteId || redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const currentBlocks = selectedSprite?.blocks ?? {};
    setUndoStack((u) => [...u, { blocks: { ...currentBlocks } }]);
    setRedoStack((r) => r.slice(0, -1));
    useSpriteStore.getState().updateSprite(selectedSpriteId, { blocks: next.blocks });
  }, [selectedSpriteId, selectedSprite, redoStack]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBlockId && selectedSpriteId) {
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') return;
        e.preventDefault();
        pushUndo();
        removeBlock(selectedSpriteId, selectedBlockId);
        setSelectedBlockId(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedBlockId, selectedSpriteId, pushUndo, removeBlock, handleUndo, handleRedo]);

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [contextMenu]);

  useEffect(() => {
    const handleAddBlockToCenter = (e: Event) => {
      const blockDef = (e as CustomEvent).detail as BlockDef;
      if (!selectedSpriteId) return;

      const scrollEl = scrollRef.current;
      if (!scrollEl) return;

      const rect = scrollEl.getBoundingClientRect();
      const scrollX = scrollEl.scrollLeft;
      const scrollY = scrollEl.scrollTop;
      const centerX = scrollX + rect.width / 2;
      const centerY = scrollY + rect.height / 2;
      const zoomOrigin = 2000;
      const x = zoomOrigin + (centerX - zoomOrigin) / workspaceZoom;
      const y = zoomOrigin + (centerY - zoomOrigin) / workspaceZoom;

      const inputs: Record<string, string | number | boolean> = {};
      if (blockDef.inputs) {
        for (const [key, inp] of Object.entries(blockDef.inputs)) {
          inputs[key] = inp.default ?? '';
        }
      }

      pushUndo();
      const newBlock: BlockInstance = {
        id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        opcode: blockDef.opcode,
        x,
        y,
        inputs,
      };
      addBlock(selectedSpriteId, newBlock);
      setSelectedBlockId(newBlock.id);
    };

    window.addEventListener('add-block-to-center', handleAddBlockToCenter);
    return () => window.removeEventListener('add-block-to-center', handleAddBlockToCenter);
  }, [selectedSpriteId, workspaceZoom, addBlock, pushUndo]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!selectedSpriteId) return;
    const data = e.dataTransfer.getData('application/codexa-block');
    if (!data) return;
    const blockDef: BlockDef = JSON.parse(data);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scrollEl = scrollRef.current;
    const scrollX = scrollEl?.scrollLeft ?? 0;
    const scrollY = scrollEl?.scrollTop ?? 0;
    const zoomOrigin = 2000;
    const x = zoomOrigin + ((e.clientX - rect.left + scrollX) - zoomOrigin) / workspaceZoom;
    const y = zoomOrigin + ((e.clientY - rect.top + scrollY) - zoomOrigin) / workspaceZoom;
    const inputs: Record<string, string | number | boolean> = {};
    if (blockDef.inputs) {
      for (const [key, inp] of Object.entries(blockDef.inputs)) {
        inputs[key] = inp.default ?? '';
      }
    }
    pushUndo();
    const newBlock: BlockInstance = {
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      opcode: blockDef.opcode,
      x,
      y,
      inputs,
    };
    if (selectedSprite) {
      for (const [id, target] of Object.entries(selectedSprite.blocks)) {
        if (!target.nextId) {
          const dy = Math.abs(target.y + 42 - newBlock.y);
          const dx = Math.abs(target.x - newBlock.x);
          if (dx < 40 && dy < 40) {
            newBlock.x = target.x;
            newBlock.y = target.y + 42;
            newBlock.parentId = target.id;
            updateBlock(selectedSpriteId, target.id, { nextId: newBlock.id });
            break;
          }
        }
      }
    }
    addBlock(selectedSpriteId, newBlock);
    setSelectedBlockId(newBlock.id);
  }, [workspaceZoom, selectedSpriteId, selectedSprite, addBlock, updateBlock, pushUndo]);

  const handleBlockMouseDown = useCallback((e: React.MouseEvent, block: BlockInstance) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setSelectedBlockId(block.id);
    setContextMenu(null);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scrollEl = scrollRef.current;
    const scrollX = scrollEl?.scrollLeft ?? 0;
    const scrollY = scrollEl?.scrollTop ?? 0;
    const clientXOnCanvas = (e.clientX - rect.left + scrollX) / workspaceZoom;
    const clientYOnCanvas = (e.clientY - rect.top + scrollY) / workspaceZoom;
    setDragOffset({ x: clientXOnCanvas - block.x, y: clientYOnCanvas - block.y });
    setDragBlockId(block.id);
    pushUndo();
  }, [workspaceZoom, pushUndo]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragBlockId || !selectedSpriteId || !selectedSprite) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    const scrollBoundary = 40;
    const scrollSpeed = 15;
    const containerRect = scrollEl.getBoundingClientRect();
    if (e.clientX < containerRect.left + scrollBoundary) scrollEl.scrollLeft -= scrollSpeed;
    else if (e.clientX > containerRect.right - scrollBoundary) scrollEl.scrollLeft += scrollSpeed;
    if (e.clientY < containerRect.top + scrollBoundary) scrollEl.scrollTop -= scrollSpeed;
    else if (e.clientY > containerRect.bottom - scrollBoundary) scrollEl.scrollTop += scrollSpeed;
    const clientXOnCanvas = (e.clientX - rect.left + scrollEl.scrollLeft) / workspaceZoom;
    const clientYOnCanvas = (e.clientY - rect.top + scrollEl.scrollTop) / workspaceZoom;
    const x = clientXOnCanvas - dragOffset.x;
    const y = clientYOnCanvas - dragOffset.y;
    updateBlock(selectedSpriteId, dragBlockId, { x, y });
    let currentId: string | undefined = selectedSprite.blocks[dragBlockId]?.nextId;
    let offset = 42;
    while (currentId && selectedSprite.blocks[currentId]) {
      updateBlock(selectedSpriteId, currentId, { x, y: y + offset });
      currentId = selectedSprite.blocks[currentId].nextId;
      offset += 42;
    }
    let foundSnap = false;
    for (const [id, target] of Object.entries(selectedSprite.blocks)) {
      if (id === dragBlockId) continue;
      if (!target.nextId) {
        const dy = Math.abs(target.y + 42 - y);
        const dx = Math.abs(target.x - x);
        if (dx < 60 && dy < 60) {
          setSnapHighlight({ x: target.x, y: target.y + 42 });
          foundSnap = true;
          break;
        }
      }
    }
    if (!foundSnap) setSnapHighlight(null);
  }, [dragBlockId, selectedSpriteId, selectedSprite, dragOffset, workspaceZoom, updateBlock]);

  const handleMouseUp = useCallback(() => {
    if (dragBlockId && selectedSpriteId && selectedSprite) {
      const block = selectedSprite.blocks[dragBlockId];
      if (block) {
        if (block.parentId) {
          updateBlock(selectedSpriteId, block.parentId, { nextId: undefined });
          updateBlock(selectedSpriteId, dragBlockId, { parentId: undefined });
        }
        for (const [id, target] of Object.entries(selectedSprite.blocks)) {
          if (id === dragBlockId) continue;
          if (!target.nextId) {
            const dy = Math.abs(target.y + 42 - block.y);
            const dx = Math.abs(target.x - block.x);
            if (dx < 60 && dy < 60) {
              const newX = target.x;
              const newY = target.y + 42;
              updateBlock(selectedSpriteId, dragBlockId, { x: newX, y: newY, parentId: id });
              updateBlock(selectedSpriteId, id, { nextId: dragBlockId });
              let currentId: string | undefined = block.nextId;
              let offset = 84;
              while (currentId && selectedSprite.blocks[currentId]) {
                updateBlock(selectedSpriteId, currentId, { x: newX, y: target.y + offset });
                currentId = selectedSprite.blocks[currentId].nextId;
                offset += 42;
              }
              break;
            }
          }
        }
      }
    }
    setDragBlockId(null);
    setSnapHighlight(null);
  }, [dragBlockId, selectedSpriteId, selectedSprite, updateBlock]);

  const handleContextMenu = useCallback((e: React.MouseEvent, blockId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, blockId });
    setSelectedBlockId(blockId);
  }, []);

  const duplicateBlock = useCallback((blockId: string) => {
    if (!selectedSpriteId || !selectedSprite) return;
    const original = selectedSprite.blocks[blockId];
    if (!original) return;
    pushUndo();
    const newBlock: BlockInstance = {
      ...original,
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      x: original.x + 30,
      y: original.y + 30,
      nextId: undefined,
      parentId: undefined,
    };
    addBlock(selectedSpriteId, newBlock);
    setContextMenu(null);
  }, [selectedSpriteId, selectedSprite, addBlock, pushUndo]);

  const deleteBlock = useCallback((blockId: string) => {
    if (!selectedSpriteId) return;
    pushUndo();
    removeBlock(selectedSpriteId, blockId);
    setSelectedBlockId(null);
    setContextMenu(null);
  }, [selectedSpriteId, removeBlock, pushUndo]);

  const handleCanvasClick = useCallback(() => {
    setSelectedBlockId(null);
    setContextMenu(null);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    }
  }, [zoomIn, zoomOut]);

  const handleBlockInputChange = useCallback((blockId: string, key: string, value: string | number) => {
    if (!selectedSpriteId || !selectedSprite) return;
    const block = selectedSprite.blocks[blockId];
    if (!block) return;
    updateBlock(selectedSpriteId, blockId, { inputs: { ...block.inputs, [key]: value } });
  }, [selectedSpriteId, selectedSprite, updateBlock]);

  // Only show workspace in Code tab; in Costumes/Sounds the left panel shows editors
  if (activeTab !== 'code') {
    return (
      <div className="workspace workspace--hidden">
        <div className="workspace__placeholder">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M8 8h32v32H8z" rx="4" fill="#F3F4F6"/>
            <path d="M16 16l8 8 8-8" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>Switch to Code to edit blocks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace">
      {/* No sprite selected message */}
      {!selectedSpriteId && (
        <div className="workspace__no-sprite">
          Select a sprite to start coding
        </div>
      )}

      {/* Scrollable Canvas */}
      <div
        className="workspace__scroll"
        ref={scrollRef}
        onWheel={handleWheel}
      >
        <div
          className="workspace__canvas"
          ref={canvasRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
          style={{ cursor: dragBlockId ? 'grabbing' : 'default' }}
        >
          <div
            className="workspace__inner"
            style={{
              transform: `scale(${workspaceZoom})`,
              transformOrigin: '2000px 2000px',
            }}
          >
            <WorkspaceGrid />

            {snapHighlight && (
              <div className="workspace__snap-highlight" style={{ left: snapHighlight.x - 2, top: snapHighlight.y - 2 }} />
            )}

            {selectedSprite && Object.values(selectedSprite.blocks).map((pb) => {
              const def = getBlockDef(pb.opcode);
              if (!def) return null;
              const cat = getCategoryForBlock(pb.opcode);
              const isSelected = pb.id === selectedBlockId;
              return (
                <div
                  key={pb.id}
                  className={`workspace__placed-block ${isSelected ? 'workspace__placed-block--selected' : ''}`}
                  style={{ left: pb.x, top: pb.y, zIndex: dragBlockId === pb.id ? 1000 : 1 }}
                  onMouseDown={(e) => handleBlockMouseDown(e, pb)}
                  onContextMenu={(e) => handleContextMenu(e, pb.id)}
                >
                  <BlockRenderer
                    block={def}
                    color={cat?.color ?? '#888'}
                    secondaryColor={cat?.secondaryColor ?? '#666'}
                    editable
                    blockId={pb.id}
                    blockInputs={pb.inputs}
                    onInputChange={(key, val) => handleBlockInputChange(pb.id, key, val)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div className="workspace__context-menu" style={{ left: contextMenu.x, top: contextMenu.y }}>
          <button onClick={() => duplicateBlock(contextMenu.blockId)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M10 4V2.5A1.5 1.5 0 008.5 1h-6A1.5 1.5 0 002.5 10H4" stroke="currentColor" strokeWidth="1.2"/></svg>
            Duplicate
          </button>
          <button onClick={() => deleteBlock(contextMenu.blockId)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V2.5A.5.5 0 015.5 2h3a.5.5 0 01.5.5V4M3 4v8a1 1 0 001 1h6a1 1 0 001-1V4" stroke="#EC5959" strokeWidth="1.2" strokeLinecap="round"/></svg>
            Delete
          </button>
          <div className="workspace__context-divider" />
          <button onClick={() => setContextMenu(null)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3v5M5 9h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            Add Comment
          </button>
        </div>
      )}

      {/* Zoom controls */}
      <div className="workspace__zoom-controls">
        <button className="workspace__zoom-btn" onClick={zoomIn} title="Zoom in">+</button>
        <button className="workspace__zoom-btn workspace__zoom-btn--label" onClick={resetZoom} title="Reset zoom">
          {Math.round(workspaceZoom * 100)}%
        </button>
        <button className="workspace__zoom-btn" onClick={zoomOut} title="Zoom out">−</button>
      </div>
    </div>
  );
}

function WorkspaceGrid() {
  return (
    <svg className="workspace__grid" width="5000" height="5000" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0.06 }}>
      <defs>
        <pattern id="grid-small" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#999" strokeWidth="0.3" />
        </pattern>
        <pattern id="grid-large" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#grid-small)" />
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#999" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-large)" />
    </svg>
  );
}
