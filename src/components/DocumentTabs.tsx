import { useCallback, useEffect, useRef, useState } from 'react';
import { useGameStore } from '../game/store/gameStore';
import type { DocumentType } from '../game/types';
import { usePaperSounds } from '../hooks/usePaperSounds';
import { DocumentTabIcon } from './DocumentTabIcon';

const TABS: { id: DocumentType; label: string }[] = [
  { id: 'application', label: 'Application' },
  { id: 'idBadge', label: 'ID Badge' },
  { id: 'resume', label: 'Resume' },
  { id: 'reference', label: 'Reference' },
];

export function DocumentTabs() {
  const activeDocument = useGameStore((s) => s.activeDocument);
  const setActiveDocument = useGameStore((s) => s.setActiveDocument);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [switchTab, setSwitchTab] = useState<DocumentType | null>(null);
  const { paperHover, paperPress } = usePaperSounds();

  useEffect(() => {
    if (!switchTab) return;
    const timer = window.setTimeout(() => setSwitchTab(null), 240);
    return () => window.clearTimeout(timer);
  }, [switchTab]);

  const focusTab = useCallback((index: number) => {
    const tab = tabRefs.current[index];
    tab?.focus();
    const next = TABS[index].id;
    setSwitchTab(next);
    setActiveDocument(next);
    paperPress();
  }, [paperPress, setActiveDocument]);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = TABS.length - 1;
    else return;

    e.preventDefault();
    focusTab(next);
  }

  return (
    <div className="document-tabs" role="tablist" aria-label="Candidate documents">
      {TABS.map((tab, index) => {
        const selected = activeDocument === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={`doc-tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls={`doc-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            title={`${tab.label} (press ${index + 1})`}
            className={`document-tabs__tab ${selected ? 'document-tabs__tab--active' : ''} ${switchTab === tab.id ? 'document-tabs__tab--switch' : ''}`}
            onMouseEnter={paperHover}
            onFocus={paperHover}
            onClick={() => focusTab(index)}
            onKeyDown={(e) => onKeyDown(e, index)}
          >
            <DocumentTabIcon type={tab.id} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
