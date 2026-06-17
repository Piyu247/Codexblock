import React, { useRef } from 'react';
import { useSpriteStore } from '../stores/spriteStore';

export default function CostumeEditor() {
  const { sprites, selectedSpriteId, updateSprite } = useSpriteStore();
  const selectedSprite = sprites.find((s) => s.id === selectedSpriteId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!selectedSprite) {
    return (
      <div className="costume-editor costume-editor--empty">
        <p>Select a sprite to edit its costumes.</p>
      </div>
    );
  }

  const isStage = selectedSprite.isStage;
  const itemLabel = isStage ? 'Backdrop' : 'Costume';

  const handleUpload = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const newCostume = {
        id: `costume-${Date.now()}`,
        name: file.name.replace(/\.[^.]+$/, ''),
        url,
        width: img.naturalWidth || 100,
        height: img.naturalHeight || 100,
      };
      updateSprite(selectedSprite.id, {
        costumes: [...selectedSprite.costumes, newCostume],
        currentCostume: selectedSprite.costumes.length,
      });
    };
    e.target.value = '';
  };

  const handleSelectCostume = (index: number) => {
    updateSprite(selectedSprite.id, { currentCostume: index });
  };

  const handleDeleteCostume = (index: number) => {
    if (selectedSprite.costumes.length <= 1) return;
    const newCostumes = selectedSprite.costumes.filter((_, i) => i !== index);
    const newCurrentCostume = Math.min(selectedSprite.currentCostume, newCostumes.length - 1);
    updateSprite(selectedSprite.id, { costumes: newCostumes, currentCostume: newCurrentCostume });
  };

  const handleRenameCostume = (index: number, name: string) => {
    const newCostumes = selectedSprite.costumes.map((c, i) => i === index ? { ...c, name } : c);
    updateSprite(selectedSprite.id, { costumes: newCostumes });
  };

  const currentCostume = selectedSprite.costumes[selectedSprite.currentCostume];

  return (
    <div className="costume-editor">
      {/* Sidebar: costume list */}
      <div className="costume-editor__sidebar">
        {/* Add costume actions */}
        <div className="costume-editor__add-actions">
          <button className="costume-editor__add-btn costume-editor__add-btn--library" title={`Choose ${itemLabel}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Choose</span>
          </button>
          <button className="costume-editor__add-btn costume-editor__add-btn--paint" title={`Paint ${itemLabel}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Paint</span>
          </button>
          <button className="costume-editor__add-btn costume-editor__add-btn--surprise" title="Surprise me">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Surprise</span>
          </button>
          <button className="costume-editor__add-btn costume-editor__add-btn--upload" title={`Upload ${itemLabel}`} onClick={handleUpload}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Upload</span>
          </button>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

        {/* Costume list */}
        <div className="costume-editor__list">
          {selectedSprite.costumes.map((costume, index) => (
            <div
              key={costume.id || index}
              className={`costume-editor__list-item ${index === selectedSprite.currentCostume ? 'costume-editor__list-item--active' : ''}`}
              onClick={() => handleSelectCostume(index)}
            >
              <div className="costume-editor__list-number">{index + 1}</div>
              <div className="costume-editor__list-thumb">
                {costume.url ? (
                  <img src={costume.url} alt={costume.name} />
                ) : (
                  <div className="costume-editor__list-thumb-placeholder">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="costume-editor__list-info">
                <input
                  className="costume-editor__list-name"
                  value={costume.name}
                  onChange={(e) => handleRenameCostume(index, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {selectedSprite.costumes.length > 1 && (
                <button
                  className="costume-editor__list-delete"
                  onClick={(e) => { e.stopPropagation(); handleDeleteCostume(index); }}
                  title="Delete"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 4h10M5 4V2.5A.5.5 0 015.5 2h3a.5.5 0 01.5.5V4M3 4v8a1 1 0 001 1h6a1 1 0 001-1V4" stroke="#EC5959" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main canvas area */}
      <div className="costume-editor__canvas">
        <div className="costume-editor__canvas-header">
          <span className="costume-editor__canvas-title">
            {currentCostume?.name || `${itemLabel} ${selectedSprite.currentCostume + 1}`}
          </span>
          <span className="costume-editor__canvas-size">
            {currentCostume?.width || 100} × {currentCostume?.height || 100}
          </span>
        </div>

        <div className="costume-editor__canvas-area">
          {currentCostume?.url ? (
            <img
              src={currentCostume.url}
              alt={currentCostume.name}
              className="costume-editor__canvas-img"
            />
          ) : (
            <div className="costume-editor__canvas-placeholder">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>Paint editor coming soon</p>
              <p className="costume-editor__canvas-hint">Upload an image to get started</p>
            </div>
          )}
        </div>

        {/* Canvas toolbar */}
        <div className="costume-editor__canvas-toolbar">
          {['Select','Reshape','Draw','Erase','Fill','Text','Line','Circle','Rect'].map((tool) => (
            <button key={tool} className="costume-editor__tool-btn" title={tool}>
              {tool[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
