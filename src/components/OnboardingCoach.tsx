import { ONBOARDING_STEPS } from '../game/data/onboarding';
import { CHARACTERS } from '../game/data/story';
import { useGameStore } from '../game/store/gameStore';
import { usePaperSounds } from '../hooks/usePaperSounds';

export function OnboardingCoach() {
  const onboardingStep = useGameStore((s) => s.onboardingStep);
  const nextOnboardingStep = useGameStore((s) => s.nextOnboardingStep);
  const skipOnboarding = useGameStore((s) => s.skipOnboarding);
  const phase = useGameStore((s) => s.phase);
  const { paperHover, paperPress } = usePaperSounds();

  if (phase !== 'playing' || onboardingStep === null) return null;

  const step = ONBOARDING_STEPS[onboardingStep];
  if (!step) return null;

  return (
    <div className="onboarding-coach onboarding-coach--modal" role="dialog" aria-labelledby="onboarding-title">
      <div className="onboarding-coach__backdrop" aria-hidden="true" />
      <div className="onboarding-coach__card">
        <span className="onboarding-coach__mentor">
          {CHARACTERS.mentor.name} · {CHARACTERS.mentor.title}
        </span>
        <span className="onboarding-coach__step">
          Step {onboardingStep + 1}/{ONBOARDING_STEPS.length}
        </span>
        <strong id="onboarding-title">{step.title}</strong>
        <p>{step.body}</p>
        {step.highlight && (
          <p className="onboarding-coach__focus">
            Focus:{' '}
            {step.highlight === 'policy'
              ? 'Policy manual (top right)'
              : step.highlight === 'crosscheck'
                ? 'Inspector desk (right column)'
                : step.highlight === 'tabs'
                  ? 'Document tabs (center)'
                  : step.highlight === 'document'
                    ? 'Document panel (center)'
                    : 'Hire / Reject buttons (bottom)'}
          </p>
        )}
        <div className="onboarding-coach__actions">
          <button
            type="button"
            onMouseEnter={paperHover}
            onFocus={paperHover}
            onClick={() => {
              paperPress();
              nextOnboardingStep();
            }}
          >
            {onboardingStep < ONBOARDING_STEPS.length - 1 ? 'Next' : 'Got it'}
          </button>
          <button
            type="button"
            className="onboarding-coach__skip"
            onMouseEnter={paperHover}
            onFocus={paperHover}
            onClick={() => {
              paperPress();
              skipOnboarding();
            }}
          >
            Skip tour
          </button>
        </div>
      </div>
    </div>
  );
}
