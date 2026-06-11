export const WAITING_QUIPS = [
  '"I brought my own spreadsheet. It has feelings."',
  '"My middle initial is legally optional. Emotionally mandatory."',
  '"I color-coded my anxiety. Is that a skill?"',
  '"I rehearsed this handshake in the parking lot."',
  '"The elevator music here is very... corporate."',
  '"I have seventeen browser tabs open. All are job boards."',
  '"Is Booth 3 always this fluorescent?"',
  '"I read the employee handbook. Twice. Out loud."',
  '"My references are real. Mostly."',
  '"I timed my arrival to the minute. Gary would be proud."',
] as const;

export const REFERENCE_BLURB_TEMPLATES = [
  '{name} is competent, punctual, and disturbingly normal. Hire before Legal finds out.',
  '{name} once fixed a critical bug using only a pivot table and sheer willpower.',
  '{name} is the only engineer who reads the docs before asking questions.',
  '{name} survived three reorgs at {company}. That counts as leadership.',
  '{name} is reliable, detail-oriented, and rarely starts office fires.',
  '{name} would be an asset to any team that values actual work.',
] as const;

export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '');
}
