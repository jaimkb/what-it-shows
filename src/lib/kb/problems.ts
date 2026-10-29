// What the reports in a merged ticket turn out to be, one problem each. Counted the desk's way:
// a report counts under the cause causes.ts files it by; the desk's notes (desk-notes.json) name the
// reports whose body shows a different bug, footnoted under the cause they're filed in.
import { groupByCause, uniqueById, type Cause, type Report, type Tenant } from '#lib/kb/causes';

// `one-day-move`: the date lands one day off, not a month/day swap. Not a parsing bug.
export type Problem = Cause | 'unplaced' | 'one-day-move';

export type ProblemGroup = {
  problem: Problem;
  reports: number;
  tenants: number;
  firstSeen: string;
  lastSeen: string;
  // For a problem read from desk notes: the causes its reports are filed and counted under.
  filedUnder: string[];
};

export function splitTicket(
  reports: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { total: number; groups: ProblemGroup[] } {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === ticket);
  const causes = groupByCause(merged, tenantOf);
  const groups: ProblemGroup[] = causes.map((g) => ({
    problem: g.cause,
    reports: g.reports.length,
    tenants: g.tenants,
    firstSeen: g.firstSeen,
    lastSeen: g.lastSeen,
    filedUnder: [],
  }));

  const moved = merged.filter((r) => oneDayMove.includes(r.id));
  if (moved.length) {
    const days = moved.map((r) => r.receivedAt.slice(0, 10)).sort();
    groups.push({
      problem: 'one-day-move',
      reports: moved.length,
      tenants: new Set(moved.map((r) => r.tenant)).size,
      firstSeen: days[0],
      lastSeen: days[days.length - 1],
      filedUnder: causes.filter((g) => g.reports.some((r) => oneDayMove.includes(r.id))).map((g) => g.cause),
    });
  }
  return { total: merged.length, groups };
}
