import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useGameStore } from '../game/store/gameStore';
import { ActionButtons } from './ActionButtons';
import { AmbientOverlay } from './AmbientOverlay';
import { CandidateBar } from './CandidateBar';
import { CandidateColumn } from './CandidateColumn';
import { DeskRail } from './DeskRail';
import { CompanyBranding } from './CompanyBranding';
import { CompanyStatusPanel } from './CompanyStatusPanel';
import { DayBriefing } from './DayBriefing';
import { DaySummary } from './DaySummary';
import { DocumentPanel } from './DocumentPanel';
import { DocumentTabs } from './DocumentTabs';
import { JuiceFlash } from './JuiceFlash';
import { MoneyPopup } from './MoneyPopup';
import { OfficeBackground } from './OfficeBackground';
import { OnboardingCoach } from './OnboardingCoach';
import { OutcomePanel } from './OutcomePanel';
import { VerificationPanel } from './VerificationPanel';

export function Desk() {
  useKeyboardShortcuts();
  const phase = useGameStore((s) => s.phase);
  const feedbackFlash = useGameStore((s) => s.feedbackFlash);
  const juicePhase = useGameStore((s) => s.juicePhase);

  const showGameplay = phase === 'playing';
  const showBriefing = phase === 'briefing';
  const showEnd = phase === 'summary' || phase === 'gameover';
  const showResolveJuice = juicePhase === 'resolve' && feedbackFlash;

  return (
    <div
      className={`desk desk--corp ${showEnd ? 'desk--summary' : ''} ${showResolveJuice ? `desk--${feedbackFlash}` : ''} ${showResolveJuice && feedbackFlash === 'correct' ? 'desk--punch' : ''} ${showResolveJuice && feedbackFlash === 'wrong' ? 'desk--shake desk--chromatic' : ''}`}
    >
      <OfficeBackground />
      <JuiceFlash />
      <AmbientOverlay />

      <header className="desk-topbar">
        <div className="desk-topbar__status">
          <CompanyStatusPanel />
        </div>
        <CompanyBranding />
        <div className="desk-topbar__rail">
          <DeskRail />
        </div>
      </header>

      <div
        className={`desk-body ${showEnd ? 'desk-body--summary' : ''} ${showBriefing ? 'desk-body--briefing' : ''}`}
      >
        {showEnd ? (
          <DaySummary inline />
        ) : (
          <>
            <CandidateColumn />

            <section className="desk-dossier">
              {showBriefing && <DayBriefing inline />}
              {showGameplay && (
                <>
                  <div className="desk-dossier__toolbar">
                    <DocumentTabs />
                  </div>
                  <div className="desk-dossier__workspace">
                    <DocumentPanel />
                    <MoneyPopup />
                  </div>
                </>
              )}
              {phase === 'menu' && (
                <div className="desk-dossier__idle">
                  <span>BOOTH OFFLINE</span>
                  <p>Select a shift from the main terminal.</p>
                </div>
              )}
            </section>

            {showGameplay && <VerificationPanel />}
          </>
        )}
      </div>

      {!showEnd && (
        <footer className={`desk-bottombar ${showBriefing ? 'desk-bottombar--briefing' : ''}`}>
          <CandidateBar />
          {!showBriefing && (
            <>
              <div className="desk-bottombar__decisions">
                <ActionButtons />
              </div>
              <OutcomePanel />
            </>
          )}
        </footer>
      )}

      <OnboardingCoach />
    </div>
  );
}
