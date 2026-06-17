import React, { useRef, useState, useEffect } from 'react';
import { useSpriteStore, type Sprite } from '../stores/spriteStore';
import { useEditorStore } from '../stores/editorStore';
import { SpriteSVG, SPRITE_LIBRARY } from './SpriteLibrary';
import { BackdropSVG, BACKDROP_LIBRARY } from './BackdropLibrary';
import { useTranslation } from '../stores/translations';

export default function SpritePanel() {
  const { sprites, selectedSpriteId, selectSprite, removeSprite, updateSprite, addSprite } = useSpriteStore();
  const { setSpriteLibraryOpen, setBackdropLibraryOpen } = useEditorStore();
  const { t } = useTranslation();
  const selectedSprite = sprites.find((s) => s.id === selectedSpriteId);
  const nonStageSprites = sprites.filter((s) => !s.isStage);
  const stage = sprites.find((s) => s.isStage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backdropInputRef = useRef<HTMLInputElement>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [addMenuPosition, setAddMenuPosition] = useState<'sprites' | 'backdrops'>('sprites');
  const addBtnRef = useRef<HTMLDivElement>(null);

  // Close add-menu on outside click
  useEffect(() => {
    if (!addMenuOpen) return;
    const close = () => setAddMenuOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [addMenuOpen]);

  const createSprite = (name?: string): Sprite => {
    const id = `sprite-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    const count = nonStageSprites.length + 1;
    return {
      id,
      name: name || `Sprite${count}`,
      isStage: false,
      x: Math.round(Math.random() * 100 - 50),
      y: Math.round(Math.random() * 100 - 50),
      size: 100,
      direction: 90,
      visible: true,
      rotationStyle: 'all around',
      draggable: false,
      costumes: [{ id: `costume-${id}`, name: 'costume1', url: '', width: 100, height: 100 }],
      currentCostume: 0,
      sounds: [],
      blocks: {},
      variables: {},
      lists: {},
    };
  };

  const handleAddSurprise = () => {
    const s = createSprite();
    addSprite(s);
    selectSprite(s.id);
    setAddMenuOpen(false);
  };

  const handleUploadSprite = () => {
    fileInputRef.current?.click();
    setAddMenuOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const s = createSprite(file.name.replace(/\.[^.]+$/, ''));
      s.costumes[0].url = url;
      s.costumes[0].width = img.naturalWidth || 100;
      s.costumes[0].height = img.naturalHeight || 100;
      addSprite(s);
      selectSprite(s.id);
    };
    e.target.value = '';
  };

  const handleBackdropFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !stage) return;
    const url = URL.createObjectURL(file);
    const newB = { id: `backdrop-${Date.now()}`, name: file.name.replace(/\.[^.]+$/, ''), url, width: 480, height: 360 };
    updateSprite(stage.id, {
      costumes: [...stage.costumes, newB],
      currentCostume: stage.costumes.length,
    });
    e.target.value = '';
  };

  const handleDuplicateSprite = (sprite: Sprite) => {
    const dup = createSprite(`${sprite.name}`);
    dup.x = sprite.x + 15;
    dup.y = sprite.y - 15;
    dup.size = sprite.size;
    dup.direction = sprite.direction;
    dup.blocks = { ...sprite.blocks };
    addSprite(dup);
    selectSprite(dup.id);
  };

  const selectedIsSprite = selectedSprite && !selectedSprite.isStage;
  const selectedIsStage = selectedSprite && selectedSprite.isStage;

  return (
    <div className="sprite-panel">
      {/* ── Sprite info row (shown when a non-stage sprite is selected) ── */}
      {selectedIsSprite && (
        <div className="sprite-info-bar">
          {/* Sprite name */}
          <div className="sprite-info-bar__field sprite-info-bar__field--name">
            <label className="sprite-info-bar__label">{t('spriteLabel')}</label>
            <input
              className="sprite-info-bar__input"
              value={selectedSprite.name}
              onChange={(e) => updateSprite(selectedSprite.id, { name: e.target.value })}
            />
          </div>
          {/* x */}
          <div className="sprite-info-bar__field">
            <label className="sprite-info-bar__label">{t('xLabel')}</label>
            <input
              className="sprite-info-bar__input sprite-info-bar__input--num"
              type="number"
              value={Math.round(selectedSprite.x)}
              onChange={(e) => updateSprite(selectedSprite.id, { x: Number(e.target.value) })}
            />
          </div>
          {/* y */}
          <div className="sprite-info-bar__field">
            <label className="sprite-info-bar__label">{t('yLabel')}</label>
            <input
              className="sprite-info-bar__input sprite-info-bar__input--num"
              type="number"
              value={Math.round(selectedSprite.y)}
              onChange={(e) => updateSprite(selectedSprite.id, { y: Number(e.target.value) })}
            />
          </div>
          {/* visibility */}
          <div className="sprite-info-bar__field sprite-info-bar__field--icon">
            <label className="sprite-info-bar__label">{t('showLabel')}</label>
            <div className="sprite-info-bar__visibility">
              <button
                className={`sprite-info-bar__vis-btn ${selectedSprite.visible ? 'sprite-info-bar__vis-btn--active' : ''}`}
                onClick={() => updateSprite(selectedSprite.id, { visible: true })}
                title="Show"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 4C5.5 4 2.5 6.5 1 9c1.5 2.5 4.5 5 8 5s6.5-2.5 8-5c-1.5-2.5-4.5-5-8-5z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
                  <circle cx="9" cy="9" r="2.5" fill="currentColor"/>
                </svg>
              </button>
              <button
                className={`sprite-info-bar__vis-btn ${!selectedSprite.visible ? 'sprite-info-bar__vis-btn--active' : ''}`}
                onClick={() => updateSprite(selectedSprite.id, { visible: false })}
                title="Hide"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2l14 14M7.5 7.7A2.5 2.5 0 0011.3 11.5M4.2 4.3C2.7 5.5 1.7 7.2 1 9c1.5 2.5 4.5 5 8 5a9.4 9.4 0 004.8-1.4M7 3.3A9.4 9.4 0 019 3c3.5 0 6.5 2.5 8 5a12.4 12.4 0 01-1.8 2.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          {/* size */}
          <div className="sprite-info-bar__field">
            <label className="sprite-info-bar__label">{t('sizeLabel')}</label>
            <input
              className="sprite-info-bar__input sprite-info-bar__input--num"
              type="number"
              value={selectedSprite.size}
              onChange={(e) => updateSprite(selectedSprite.id, { size: Number(e.target.value) })}
            />
          </div>
          {/* direction */}
          <div className="sprite-info-bar__field">
            <label className="sprite-info-bar__label">{t('directionLabel')}</label>
            <input
              className="sprite-info-bar__input sprite-info-bar__input--num"
              type="number"
              value={selectedSprite.direction}
              onChange={(e) => updateSprite(selectedSprite.id, { direction: Number(e.target.value) })}
            />
          </div>
        </div>
      )}

      {/* ── Stage info row (shown when stage is selected) ── */}
      {selectedIsStage && stage && (
        <div className="sprite-info-bar sprite-info-bar--stage">
          <div className="sprite-info-bar__field sprite-info-bar__field--name">
            <label className="sprite-info-bar__label">{t('stageHeader')}</label>
            <span className="sprite-info-bar__stage-name">{t('stageHeader')}</span>
          </div>
          <div className="sprite-info-bar__field">
            <label className="sprite-info-bar__label">{t('backdropsLabel')}</label>
            <span className="sprite-info-bar__badge">{stage.costumes.length}</span>
          </div>
        </div>
      )}

      {/* ── Sprites & Stage section ── */}
      <div className="sprite-panel__main">

        {/* Sprites label row */}
        <div className="sprite-panel__section-header">
          <span className="sprite-panel__section-label">{t('spritesHeader')}</span>
        </div>

        {/* Sprite grid */}
        <div className="sprite-panel__grid">
          {nonStageSprites.map((sprite) => (
            <SpriteCard
              key={sprite.id}
              sprite={sprite}
              isSelected={sprite.id === selectedSpriteId}
              onSelect={() => selectSprite(sprite.id)}
              onDelete={() => removeSprite(sprite.id)}
              onDuplicate={() => handleDuplicateSprite(sprite)}
            />
          ))}
        </div>

        {/* Stage thumbnail section */}
        {stage && (
          <div className="sprite-panel__stage-section">
            <div className="sprite-panel__section-header">
              <span className="sprite-panel__section-label">{t('stageHeader')}</span>
            </div>
            <div
              className={`sprite-panel__stage-card ${selectedSpriteId === stage.id ? 'sprite-panel__stage-card--selected' : ''}`}
              onClick={() => selectSprite(stage.id)}
            >
              <div className="sprite-panel__stage-thumb">
                {stage.costumes[stage.currentCostume]?.url ? (
                  <img src={stage.costumes[stage.currentCostume].url} alt="Stage" />
                ) : stage.costumes[stage.currentCostume]?.backdropPattern ? (
                  <div className="sprite-panel__stage-svg-preview" style={{ width: 32, height: 24, overflow: 'hidden' }}>
                    {(() => {
                      const entry = BACKDROP_LIBRARY.find((b) => b.pattern === stage.costumes[stage.currentCostume].backdropPattern);
                      return entry ? <BackdropSVG entry={entry} width={32} height={24} /> : null;
                    })()}
                  </div>
                ) : (
                  <div className="sprite-panel__stage-thumb-bg">
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                      <rect width="32" height="24" rx="2" fill="#E5E7EB"/>
                      <path d="M4 18l6-6 4 4 5-7 8 9H4z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                )}
              </div>
              <span className="sprite-panel__stage-name">{t('stageHeader')}</span>
            </div>

            {/* Backdrop controls */}
            <div className="sprite-panel__backdrop-actions">
              <button
                className="sprite-panel__backdrop-btn"
                onClick={() => setBackdropLibraryOpen(true)}
                title={t('chooseBackdrop')}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" fill="#FF8C1A"/>
                  <path d="M7 4v6M4 7h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {t('addSpriteLabel')}
              </button>
              <button
                className="sprite-panel__backdrop-btn"
                onClick={() => backdropInputRef.current?.click()}
                title={t('uploadBackdrop')}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 3v6M4 6l3-3 3 3" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 11h10" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {t('uploadBackdrop')}
              </button>
            </div>

            <input ref={backdropInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBackdropFileChange} />
          </div>
        )}
      </div>

      {/* ── Floating Add Sprite button (bottom right) ── */}
      <div className="sprite-panel__add-sprite-container" ref={addBtnRef}>
        {addMenuOpen && (
          <div className="sprite-panel__add-flyout" onClick={(e) => e.stopPropagation()}>
            <button
              className="sprite-panel__flyout-item sprite-panel__flyout-item--library"
              onClick={() => { setSpriteLibraryOpen(true); setAddMenuOpen(false); }}
            >
              <span className="sprite-panel__flyout-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" fill="#4C97FF"/>
                  <path d="M5.5 9a3.5 3.5 0 107 0 3.5 3.5 0 00-7 0z" fill="white" opacity="0.5"/>
                  <path d="M9 6v6M6 9h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <span>{t('chooseSprite')}</span>
            </button>
            <button
              className="sprite-panel__flyout-item sprite-panel__flyout-item--paint"
              onClick={() => { setAddMenuOpen(false); }}
            >
              <span className="sprite-panel__flyout-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" fill="#9966FF"/>
                  <path d="M12 6l-5.5 5.5M10 5l2 1M7 12l-2 1" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </span>
              <span>{t('paintSprite')}</span>
            </button>
            <button
              className="sprite-panel__flyout-item sprite-panel__flyout-item--surprise"
              onClick={handleAddSurprise}
            >
              <span className="sprite-panel__flyout-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" fill="#FFAB19"/>
                  <path d="M9 5v5M9 12.5v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <span>{t('surpriseSprite')}</span>
            </button>
            <button
              className="sprite-panel__flyout-item sprite-panel__flyout-item--upload"
              onClick={handleUploadSprite}
            >
              <span className="sprite-panel__flyout-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" fill="#59C059"/>
                  <path d="M9 5v6M6 8l3-3 3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 13h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <span>{t('uploadSprite')}</span>
            </button>
          </div>
        )}

        <button
          id="btn-add-sprite"
          className={`sprite-panel__add-btn ${addMenuOpen ? 'sprite-panel__add-btn--open' : ''}`}
          onClick={(e) => { e.stopPropagation(); setAddMenuOpen(!addMenuOpen); }}
          title={t('chooseSprite')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
    </div>
  );
}

// ─── Sprite Card ─────────────────────────────────────────────────────────────

interface SpriteCardProps {
  sprite: Sprite;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function SpriteCard({ sprite, isSelected, onSelect, onDelete, onDuplicate }: SpriteCardProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [contextMenu]);

  return (
    <div
      className={`sprite-card ${isSelected ? 'sprite-card--selected' : ''}`}
      onClick={onSelect}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
      }}
    >
      {/* Delete button (always visible on hover) */}
      <button
        className="sprite-card__delete-btn"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        title={t('delete')}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1l8 8M9 1L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      <div className="sprite-card__preview">
        {sprite.costumes[sprite.currentCostume]?.url ? (
          <img
            src={sprite.costumes[sprite.currentCostume].url}
            alt={sprite.name}
            className="sprite-card__img"
          />
        ) : sprite.costumes[sprite.currentCostume]?.svgShape ? (
          <div className="sprite-card__svg-preview" style={{ width: 48, height: 48 }}>
            {/* Import SPRITE_LIBRARY and SpriteSVG dynamically or render using SpriteSVG */}
            {(() => {
              const libraryEntry = SPRITE_LIBRARY.find((e) => e.shape === sprite.costumes[sprite.currentCostume].svgShape);
              return libraryEntry ? <SpriteSVG entry={libraryEntry} size={48} /> : null;
            })()}
          </div>
        ) : (
          <div className="sprite-card__placeholder" style={{ background: '#4C97FF' }}>
            {sprite.name[0].toUpperCase()}
          </div>
        )}
      </div>
      <div className="sprite-card__name">{sprite.name}</div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="sprite-card__context-menu"
          style={{ position: 'fixed', left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => { onDuplicate(); setContextMenu(null); }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M10 4V2.5A1.5 1.5 0 008.5 1h-6A1.5 1.5 0 001 2.5v6A1.5 1.5 0 002.5 10H4" stroke="currentColor" strokeWidth="1.2"/></svg>
            {t('duplicate')}
          </button>
          <div className="sprite-card__context-divider"/>
          <button className="sprite-card__context-danger" onClick={() => { onDelete(); setContextMenu(null); }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V2.5A.5.5 0 015.5 2h3a.5.5 0 01.5.5V4M3 4v8a1 1 0 001 1h6a1 1 0 001-1V4" stroke="#EC5959" strokeWidth="1.2" strokeLinecap="round"/></svg>
            {t('delete')}
          </button>
        </div>
      )}
    </div>
  );
}
