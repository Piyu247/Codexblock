import React, { useMemo } from 'react';
import { blockCategories, type BlockDef } from '../blocks/blockDefinitions';
import { useEditorStore } from '../stores/editorStore';
import { useSpriteStore } from '../stores/spriteStore';
import { useTranslation, type TranslationKeys } from '../stores/translations';
import BlockRenderer from './BlockRenderer';
import CostumeEditor from './CostumeEditor';
import SoundEditor from './SoundEditor';

export default function BlocksPalette() {
  const { selectedCategory, setSelectedCategory, activeTab, setActiveTab } = useEditorStore();
  const { t } = useTranslation();

  const category = useMemo(
    () => blockCategories.find((c) => c.id === selectedCategory) ?? blockCategories[0],
    [selectedCategory]
  );

  const getTranslatedCategoryName = (id: string, defaultName: string) => {
    const key = `cat${id.charAt(0).toUpperCase() + id.slice(1)}` as TranslationKeys;
    return t(key) || defaultName;
  };

  return (
    <div className="blocks-palette">
      {/* Code / Costumes / Sounds tabs — matches Scratch 3 */}
      <div className="blocks-palette__tabs">
        <button
          id="tab-code"
          className={`blocks-palette__tab ${activeTab === 'code' ? 'blocks-palette__tab--active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M5.5 3L1 8l4.5 5M10.5 3L15 8l-4.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('codeTab')}
        </button>
        <button
          id="tab-costumes"
          className={`blocks-palette__tab ${activeTab === 'costumes' ? 'blocks-palette__tab--active' : ''}`}
          onClick={() => setActiveTab('costumes')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="6" cy="7" r="1.5" fill="currentColor"/>
            <path d="M2 12l3-3 2 2 3-4 4 5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          {t('costumesTab')}
        </button>
        <button
          id="tab-sounds"
          className={`blocks-palette__tab ${activeTab === 'sounds' ? 'blocks-palette__tab--active' : ''}`}
          onClick={() => setActiveTab('sounds')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 6h2l3-3v10L5 10H3a1 1 0 01-1-1V7a1 1 0 011-1z" fill="currentColor"/>
            <path d="M11 5a4 4 0 010 6M13 3a7 7 0 010 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {t('soundsTab')}
        </button>
      </div>

      {/* Costume editor */}
      {activeTab === 'costumes' && <CostumeEditor />}

      {/* Sound editor */}
      {activeTab === 'sounds' && <SoundEditor />}

      {/* Blocks palette (Code tab) */}
      {activeTab === 'code' && (
        <div className="blocks-palette__body">
          {/* Category tabs */}
          <div className="blocks-palette__categories">
            {blockCategories.map((cat) => (
              <button
                key={cat.id}
                className={`blocks-palette__cat-btn ${selectedCategory === cat.id ? 'blocks-palette__cat-btn--active' : ''}`}
                style={{
                  '--cat-color': cat.color,
                  '--cat-secondary': cat.secondaryColor,
                } as React.CSSProperties}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="blocks-palette__cat-dot" style={{ background: cat.color }} />
                <span className="blocks-palette__cat-name">{getTranslatedCategoryName(cat.id, cat.name)}</span>
              </button>
            ))}
          </div>

          {/* Blocks list */}
          <div className="blocks-palette__blocks">
            <div className="blocks-palette__section-title" style={{ color: category.color }}>
              {getTranslatedCategoryName(category.id, category.name)}
            </div>
            {category.blocks.map((block) => (
              <div
                key={block.opcode}
                className="blocks-palette__block-wrapper"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/codexa-block', JSON.stringify(block));
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const store = useSpriteStore.getState();
                  if (!store.selectedSpriteId) return;
                  const event = new CustomEvent('add-block-to-center', { detail: block });
                  window.dispatchEvent(event);
                }}
              >
                <BlockRenderer block={block} color={category.color} secondaryColor={category.secondaryColor} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
