import { useEffect, useRef } from 'react';
import { RunProgress } from './components/RunProgress';
import { Desk } from './components/Desk';
import { TitleScreen } from './components/TitleScreen';
import { useGameStore } from './game/store/gameStore';

export function App() {
  const phase = useGameStore((s) => s.phase);
  const progress = useGameStore((s) => s.progress);
  const startNewRun = useGameStore((s) => s.startNewRun);
  const autoStarted = useRef(false);

  useEffect(() => {
    if (!autoStarted.current && !progress.onboardingComplete) {
      autoStarted.current = true;
      startNewRun();
    }
  }, [progress.onboardingComplete, startNewRun]);

  if (phase === 'menu') {
    return (
      <div className={`app-shell ${progress.onboardingComplete ? 'app-shell--menu' : ''}`}>
        <TitleScreen />
        {progress.onboardingComplete && <RunProgress />}
      </div>
    );
  }

  return (
    <div className="app-shell app-shell--desk">
      <Desk />
    </div>
  );
}
