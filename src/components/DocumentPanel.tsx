import { GAME_DATE } from '../game/data/positions';
import { useGameStore } from '../game/store/gameStore';
import { CandidatePhoto } from './CandidatePhoto';
import { StampBurst } from './StampBurst';
import type { Candidate, DocumentType } from '../game/types';

function DocField({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className={`doc-field ${className}`}>
      <span className="doc-field__label">{label}</span>
      <span className="doc-field__value">{value}</span>
    </div>
  );
}

export function DocumentPanel() {
  const candidateIndex = useGameStore((s) => s.candidateIndex);
  const candidates = useGameStore((s) => s.candidates);
  const activeDocument = useGameStore((s) => s.activeDocument);
  const juicePhase = useGameStore((s) => s.juicePhase);
  const stampVisible = useGameStore((s) => s.stampVisible);
  const stampType = useGameStore((s) => s.stampType);
  const docAnimKey = useGameStore((s) => s.docAnimKey);
  const ruleContext = useGameStore((s) => s.ruleContext);
  const salaryCap = ruleContext.salaryCap;

  const candidate = candidates[candidateIndex];
  if (!candidate) return null;

  return (
    <div
      className="document-panel"
      role="tabpanel"
      id={`doc-panel-${activeDocument}`}
      aria-labelledby={`doc-tab-${activeDocument}`}
    >
      {candidate.isTutorial && (
        <div className="document-panel__tutorial">
          <span className="document-panel__tutorial-pulse" />
          Dana vouches for Alice. Read all four documents yourself. Stamp when satisfied.
        </div>
      )}
      <div
        key={`${candidateIndex}-${activeDocument}-${docAnimKey}`}
        className={`document-panel__paper document-panel__paper--${activeDocument} ${stampVisible && juicePhase !== 'idle' ? 'document-panel__paper--impact' : ''}`}
      >
        {renderDocument(activeDocument, candidate, salaryCap)}
        {stampVisible && juicePhase !== 'idle' && <StampBurst />}
        {stampVisible && stampType && juicePhase !== 'idle' && (
          <>
            <div className={`stamp-splatter stamp-splatter--${stampType}`} />
            <div className={`stamp stamp--${stampType}`}>
              <span className="stamp__text">{stampType === 'hire' ? 'HIRED!' : 'NOPE!'}</span>
              <span className="stamp__sub">BOOTH 3 SAYS SO</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function renderDocument(type: DocumentType, candidate: Candidate, salaryCap: number) {
  switch (type) {
    case 'application':
      return (
        <div className="doc-layout doc-layout--form">
          <div className="doc-layout__header">
            <div className="doc-layout__corp-logo">OC</div>
            <h3 className="doc-title">Interview Application Form</h3>
            <span className="doc-layout__form-id">FORM-HR-104 · v2.1 (mandatory fun)</span>
          </div>
          <DocField label="Full Name" value={candidate.application.fullName} />
          <DocField label="Position Applied" value={candidate.application.position} />
          <div className="doc-field">
            <span className="doc-field__label">Date Applied</span>
            <span className="doc-field__value">{candidate.application.dateApplied}</span>
          </div>
          <div className="doc-field">
            <span className="doc-field__label">Interview Slot</span>
            <span className="doc-field__value">{candidate.application.interviewSlot}</span>
          </div>
          <DocField
            label="Salary Expectation"
            value={`$${candidate.application.salaryExpectation.toLocaleString()}`}
          />
          <div className="doc-layout__cap-note">Daily cap: ${salaryCap.toLocaleString()} / Brenda's snack budget</div>
          <div className="doc-layout__footer">OpenCorp Inc. — Where paperwork meets destiny</div>
        </div>
      );
    case 'idBadge':
      return (
        <div className="doc-layout doc-layout--badge">
          <div className="id-badge-card">
            <div className="id-badge-card__stripe" />
            <div className="id-badge-card__photo">
              <CandidatePhoto
                candidateId={candidate.id}
                gender={candidate.gender}
                alt={`ID photo of ${candidate.idBadge.fullName}`}
                className="id-badge-card__photo-img"
              />
              <span className="id-badge-card__photo-id">{candidate.idBadge.photoId}</span>
            </div>
            <div className="id-badge-card__body">
              <span className="id-badge-card__corp">OPENCORP</span>
              <span className="id-badge-card__name">{candidate.idBadge.fullName}</span>
              <span className="id-badge-card__num">{candidate.idBadge.badgeNumber}</span>
              <div className="id-badge-card__dates">
                <span>ISS {candidate.idBadge.issueDate}</span>
                <span>EXP {candidate.idBadge.expiryDate}</span>
              </div>
            </div>
            <div className="id-badge-card__barcode" aria-hidden="true">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="id-badge-card__bar" style={{ height: `${40 + (i % 5) * 12}%` }} />
              ))}
            </div>
          </div>
        </div>
      );
    case 'resume':
      return (
        <div className="doc-layout doc-layout--resume">
          <h3 className="doc-title">Curriculum Vitae</h3>
          <div className="resume-header">
            <span className="resume-header__name">{candidate.resume.fullName}</span>
            <span className="resume-header__role">{candidate.resume.position}</span>
          </div>
          <div className="resume-grid">
            <DocField label="Years Experience" value={`${candidate.resume.yearsExperience} yrs`} />
            <div className="doc-field">
              <span className="doc-field__label">Education</span>
              <span className="doc-field__value">{candidate.resume.education}</span>
            </div>
            <div className="doc-field">
              <span className="doc-field__label">Last Employer</span>
              <span className="doc-field__value">{candidate.resume.lastEmployer}</span>
            </div>
          </div>
          <div className="resume-skills">
            <span className="doc-field__label">Skills</span>
            <div className="resume-skills__tags">
              {candidate.resume.skills.map((skill) => (
                <span key={skill} className="resume-skills__tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          {candidate.resume.certifications.length > 0 && (
            <div className="resume-certs">
              <span className="doc-field__label">Certifications</span>
              <div className="resume-skills__tags">
                {candidate.resume.certifications.map((cert) => (
                  <span key={cert} className="resume-skills__tag resume-skills__tag--cert">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="resume-timeline resume-timeline--compact">
            {candidate.resume.workHistory.slice(0, 2).map((entry) => (
              <span key={`${entry.company}-${entry.role}`} className="resume-timeline__chip">
                {entry.years}y {entry.role} @ {entry.company}
              </span>
            ))}
          </div>
        </div>
      );
    case 'reference':
      return (
        <div className="doc-layout doc-layout--letter">
          <h3 className="doc-title">Reference Letter</h3>
          <p className="reference-letter__date">
            {candidate.reference.recommendationDate}
            <span className="reference-letter__today"> (today: {GAME_DATE})</span>
          </p>
          <p className="reference-letter__salutation">To Whom It May Concern,</p>
          <p className="reference-letter__body reference-letter__body--compact">
            I recommend <strong>{candidate.reference.candidateName}</strong> —{' '}
            <em>{candidate.reference.relationship}</em> at{' '}
            <strong>{candidate.reference.referrerCompany}</strong>. {candidate.referenceBlurb}
          </p>
          <p className="reference-letter__sign">Sincerely,</p>
          <p className="reference-letter__name">{candidate.reference.referrerName}</p>
          <p className="reference-letter__company">{candidate.reference.referrerCompany}</p>
        </div>
      );
  }
}
