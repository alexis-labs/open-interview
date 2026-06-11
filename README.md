# Open Interview

Corporate *Papers, Please*–style HR screening game. You sit in **Booth 3** at OpenCorp Inc., review candidate documents, and stamp **HIRE** or **REJECT** before Brenda notices.

Each **run** is 10 procedural shifts with a tight payroll budget. Every queue is randomly generated — names, employers, violations, and salaries change every time.

## Play

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

1. Click **Start New Run** (first-time players get **Start Orientation** with a guided tutorial).
2. Read the day briefing, then **Begin Shift**.
3. Open all four documents — Application, ID Badge, Resume, Reference — and cross-check them against the policy manual.
4. Stamp **HIRE** when there are no violations, **REJECT** when there is any issue.
5. Finish the shift within the error limit and without hitting **$0** budget.
6. Continue to the next day until you clear all **10 shifts** or fail.

Progress (best day reached, runs completed, onboarding) is saved in `localStorage`.

## Gameplay

### Documents

| Document    | What to check                                      |
|------------|-----------------------------------------------------|
| Application | Name, role, salary expectation, date             |
| ID Badge    | Name, expiry date                                  |
| Resume      | Name, role, years of experience, employer          |
| Reference   | Candidate name, referrer company                     |

Nothing is auto-highlighted on the papers during play — you verify everything yourself.

### Policy rules (7 total)

Rules unlock over the run:

| Rule | Check |
|------|--------|
| 1 | Full name matches on all four documents |
| 2 | Role is Software Engineer, Product Manager, or Data Analyst |
| 3 | ID badge is not expired (game date: 2026-06-10) |
| 4 | Resume meets minimum years for the role |
| 5 | Reference company is on the verified list |
| 6 | Resume position matches application |
| 7 | Salary expectation is at or below the day's cap |

**HIRE** only if zero violations. **REJECT** if any rule fails.

### 10-day run curve

| Days | New rules | Candidates | Start budget | Max errors | Salary cap |
|------|-----------|------------|--------------|------------|------------|
| 1 | 1-2 | 3 | $74 | 3 | $120k |
| 2 | +3 | 4 | $70 | 3 | $115k |
| 3 | +4 | 5 | $64 | 2 | $110k |
| 4 | +5 | 5 | $60 | 2 | $105k |
| 5 | +6 | 6 | $56 | 2 | $100k |
| 6 | +7 | 6 | $52 | 2 | $95k |
| 7 | all | 6 | $50 | 1 | $90k |
| 8-9 | all | 7 | $48 | 1 | $88k |
| 10 | all | 8 | $45 | **0** | $85k |

The first shifts play like a small blind: fewer rules, fewer candidates, and more clean files. Later shifts keep all rules active while lowering the clean-file rate and increasing the chance that a bad file hides multiple violations.

### Payroll

- Correct decision: **+$4**
- Wrong decision: **−$12**
- Budget resets each shift (does not carry between days).
- **Game over** if balance reaches **$0** mid-shift.

### Procedural candidates

Candidates are generated per shift from seeded RNG (`runSeed` + day + index):

- Random names with optional prefixes (`Dr.`, `Ms.`, `Mr.`, …)
- Plausible employers, skills, education, and work history
- ~35–55% clean files (rate drops on later days)
- Invalid files get 1–2 deliberate violations among **active** rules only

The first candidate on your very first run is always clean for the onboarding tutorial.

**Retry Shift** regenerates the same day with the same run seed. **Start New Run** rolls a new seed and a new full queue.

## Development

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Vitest watch mode |

### Stack

- React 19 + TypeScript
- Vite 6
- Zustand (game state)
- Vitest (unit tests)

### Project layout

```
src/
├── components/       # UI (desk, documents, briefing, summary)
├── game/
│   ├── data/         # Days config, rules, name/company pools, story
│   ├── engine/       # Rule engine, candidate generator, game logic
│   ├── store/        # Zustand game store
│   └── types.ts
├── hooks/
└── styles/
```

Key modules:

- `src/game/engine/candidateGenerator.ts` — procedural CV generation
- `src/game/engine/ruleEngine.ts` — violation detection
- `src/game/data/days.ts` — 10-day difficulty curve
- `src/game/store/gameStore.ts` — run lifecycle and session state

Static candidates in `src/game/data/candidates.ts` are kept as **test fixtures** only; live play uses the generator.

### Candidate placeholder images

```bash
python scripts/generate-candidate-placeholders.py
```

Generates avatar PNGs used by `candidatePhotoPool.ts` (random photo per candidate per shift).

## License

Private project (`package.json` → `"private": true`).
