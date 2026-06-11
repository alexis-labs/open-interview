import { useState } from 'react';

import { SOUND_IDS } from '../game/audio/soundIds';
import { soundManager } from '../game/audio/soundManager';

import { loadSettings, setSoundEnabled } from '../game/engine/settingsStore';

import { useGameStore } from '../game/store/gameStore';

import { TITLE_LORE } from '../game/data/story';



export function TitleScreen() {

  const progress = useGameStore((s) => s.progress);

  const startNewRun = useGameStore((s) => s.startNewRun);

  const resetProgress = useGameStore((s) => s.resetProgress);

  const runComplete = useGameStore((s) => s.runComplete);

  const [soundEnabled, setSoundEnabledState] = useState(() => loadSettings().soundEnabled);



  function handleStart() {

    void soundManager.init();

    startNewRun();

  }



  function toggleSound() {

    const next = !soundEnabled;

    setSoundEnabledState(next);

    setSoundEnabled(next);

    if (next) {

      void soundManager.init().then(() => soundManager.play(SOUND_IDS.uiConfirm));

    }

  }



  return (

    <div className="title-screen">

      <div className="title-screen__card">

        <div className="title-screen__logo">OPENCORP</div>

        <h1>Open Interview</h1>

        <p className="title-screen__tagline">HR Division — Screening Booth 3</p>

        <p className="title-screen__hook">{TITLE_LORE.hook}</p>

        <p className="title-screen__intro">{TITLE_LORE.incident}</p>

        <p className="title-screen__propaganda">{TITLE_LORE.propaganda}</p>

        {runComplete && (

          <p className="title-screen__run-complete">

            Last run: all 10 shifts cleared. Brenda upgraded your stapler.

          </p>

        )}

        {progress.bestRunDay > 0 && !runComplete && (

          <p className="title-screen__best">

            Best run: Day {progress.bestRunDay} of 10

          </p>

        )}

        <button type="button" className="title-screen__start" onClick={handleStart}>

          {!progress.onboardingComplete ? 'Start Orientation' : 'Start New Run'}

        </button>

        <label className="title-screen__settings">

          <input type="checkbox" checked={soundEnabled} onChange={toggleSound} />

          Sound FX

        </label>

        <button type="button" className="title-screen__reset" onClick={resetProgress}>

          Reset Progress

        </button>

      </div>

    </div>

  );

}


