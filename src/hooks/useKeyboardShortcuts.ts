import { useEffect } from 'react';
import { useGameStore } from '../game/store/gameStore';
import type { DocumentType } from '../game/types';

const DOC_KEYS: Record<string, DocumentType> = {
  '1': 'application',
  '2': 'idBadge',
  '3': 'resume',
  '4': 'reference',
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export function useKeyboardShortcuts() {
  const phase = useGameStore((s) => s.phase);
  const juicePhase = useGameStore((s) => s.juicePhase);
  const setActiveDocument = useGameStore((s) => s.setActiveDocument);
  const hire = useGameStore((s) => s.hire);
  const reject = useGameStore((s) => s.reject);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;
      if (phase !== 'playing' || juicePhase !== 'idle') return;

      const doc = DOC_KEYS[e.key];
      if (doc) {
        e.preventDefault();
        setActiveDocument(doc);
        return;
      }

      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        hire();
        return;
      }

      if (e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        reject();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, juicePhase, setActiveDocument, hire, reject]);
}
