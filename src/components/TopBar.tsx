import React, { useState } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { useTranslation } from '../stores/translations';

export default function TopBar() {
  const { project, setProjectName, resetProject, language, toggleLanguage } = useProjectStore();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(project.name);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);

  const closeMenus = () => {
    setShowFileMenu(false);
    setShowEditMenu(false);
  };

  const handleNameSubmit = () => {
    setProjectName(tempName.trim() || t('untitledProject'));
    setEditing(false);
  };

  const currentProjectName = project.name === 'Untitled Project' ? t('untitledProject') : project.name;

  return (
    <header className="topbar" onClick={(e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.topbar__menu-item')) closeMenus();
    }}>
      {/* Logo */}
      <div className="topbar__logo">
        <div className="topbar__logo-icon">
          <svg viewBox="0 0 40 40" width="28" height="28">
            <rect rx="6" width="40" height="40" fill="rgba(255,255,255,0.15)" />
            <text x="20" y="28" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="Inter, sans-serif">C</text>
          </svg>
        </div>
        <span className="topbar__logo-text">CodexaBlock</span>
      </div>

      {/* File Menu */}
      <div className="topbar__menu-group">
        <div className="topbar__menu-item">
          <button
            className="topbar__menu-btn"
            onClick={(e) => { e.stopPropagation(); setShowFileMenu(!showFileMenu); setShowEditMenu(false); }}
          >
            {t('file')}
          </button>
          {showFileMenu && (
            <div className="topbar__dropdown">
              <button onClick={() => { resetProject(); closeMenus(); }}>{t('new')}</button>
              <button onClick={closeMenus}>{t('saveToComputer')}</button>
              <button onClick={closeMenus}>{t('loadFromComputer')}</button>
            </div>
          )}
        </div>
        <div className="topbar__menu-item">
          <button
            className="topbar__menu-btn"
            onClick={(e) => { e.stopPropagation(); setShowEditMenu(!showEditMenu); setShowFileMenu(false); }}
          >
            {t('edit')}
          </button>
          {showEditMenu && (
            <div className="topbar__dropdown">
              <button onClick={closeMenus}>{t('undo')}</button>
              <button onClick={closeMenus}>{t('redo')}</button>
              <div className="topbar__dropdown-divider" />
              <button onClick={closeMenus}>{t('turboMode')}</button>
            </div>
          )}
        </div>
      </div>

      {/* Project Name */}
      <div className="topbar__project-name">
        {editing ? (
          <input
            className="topbar__name-input"
            autoFocus
            value={tempName === 'Untitled Project' ? t('untitledProject') : tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => { if (e.key === 'Enter') handleNameSubmit(); if (e.key === 'Escape') setEditing(false); }}
          />
        ) : (
          <button className="topbar__name-display" onClick={() => { setTempName(project.name); setEditing(true); }}>
            {currentProjectName}
          </button>
        )}
      </div>

      {/* Spacer */}
      <div className="topbar__spacer" />

      {/* Right section */}
      <div className="topbar__right">
        <button
          className={`topbar__tutorials-btn ${language === 'mr' ? 'topbar__tutorials-btn--active' : ''}`}
          onClick={() => toggleLanguage()}
        >
          🌐 {language === 'en' ? 'मराठी' : 'English'}
        </button>
        <button className="topbar__tutorials-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12.5A5.5 5.5 0 118 2.5a5.5 5.5 0 010 11zM8 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 5zm0 6.5a.75.75 0 100-1.5.75.75 0 000 1.5z" fill="currentColor"/>
          </svg>
          {t('tutorials')}
        </button>
      </div>
    </header>
  );
}
