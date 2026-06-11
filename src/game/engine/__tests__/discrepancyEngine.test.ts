import { describe, expect, it } from 'vitest';

import { CANDIDATES } from '../../data/candidates';

import { getCrossCheckRows, getFlaggedFields } from '../discrepancyEngine';



describe('discrepancyEngine', () => {

  it('flags name fields for Priya Nair under rule 1', () => {

    const flags = getFlaggedFields(CANDIDATES[2], 1);

    expect(flags.has('idBadge.name')).toBe(true);

  });



  it('flags resume position for Ryan Cho under rule 6', () => {

    const flags = getFlaggedFields(CANDIDATES[7], 6);

    expect(flags.has('resume.position')).toBe(true);

    expect(flags.has('application.position')).toBe(true);

  });



  it('cross-check shows position mismatch for Ryan', () => {

    const rows = getCrossCheckRows(CANDIDATES[7]);

    const position = rows.find((r) => r.label === 'Position');

    expect(position?.ok).toBe(false);

  });



  it('flags salary for Omar under all active rules', () => {

    const flags = getFlaggedFields(CANDIDATES[9]);

    expect(flags.has('application.salary')).toBe(true);

  });


});


