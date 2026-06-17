import React, { useState, useCallback, useRef, useEffect } from 'react';
import TopBar from '../components/TopBar';
import BlocksPalette from '../components/BlocksPalette';
import Workspace from '../components/Workspace';
import StageArea from '../components/StageArea';
import SpritePanel from '../components/SpritePanel';
import SpriteLibrary from '../components/SpriteLibrary';
import BackdropLibrary from '../components/BackdropLibrary';

export default function App() {
  // Left panel width (blocks palette)
  const [leftWidth, setLeftWidth] = useState(280);
  // Right panel width (stage + sprite panel)
  const [rightWidth, setRightWidth] = useState(400);

  const draggingRef = useRef<'left' | 'right' | null>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = useCallback((side: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = side;
    startXRef.current = e.clientX;
    startWidthRef.current = side === 'left' ? leftWidth : rightWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [leftWidth, rightWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      if (draggingRef.current === 'left') {
        const dx = e.clientX - startXRef.current;
        setLeftWidth(Math.max(220, Math.min(480, startWidthRef.current + dx)));
      } else if (draggingRef.current === 'right') {
        const dx = e.clientX - startXRef.current;
        setRightWidth(Math.max(300, Math.min(560, startWidthRef.current - dx)));
      }
    };
    const handleMouseUp = () => {
      if (draggingRef.current) {
        draggingRef.current = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="editor-layout">
      <TopBar />

      <div className="editor-main">
        {/* LEFT PANEL: Code/Costumes/Sounds tabs + blocks palette */}
        <div className="editor-left" style={{ width: leftWidth }}>
          <BlocksPalette />
        </div>

        {/* Left resizer */}
        <div
          className="editor-resizer editor-resizer--left"
          onMouseDown={(e) => handleMouseDown('left', e)}
        />

        {/* CENTER: Workspace canvas */}
        <div className="editor-center">
          <Workspace />
        </div>

        {/* Right resizer */}
        <div
          className="editor-resizer editor-resizer--right"
          onMouseDown={(e) => handleMouseDown('right', e)}
        />

        {/* RIGHT PANEL: Stage (top) + Sprite panel (bottom, fills rest) */}
        <div className="editor-right" style={{ width: rightWidth }}>
          <div className="editor-right__stage">
            <StageArea />
          </div>
          <div className="editor-right__sprites">
            <SpritePanel />
          </div>
        </div>
      </div>

      {/* Library modals (rendered at top level to overlay everything) */}
      <SpriteLibrary />
      <BackdropLibrary />
    </div>
  );
}