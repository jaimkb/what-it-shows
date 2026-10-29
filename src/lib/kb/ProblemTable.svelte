<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitTicket, type Problem } from '#lib/kb/problems';

  // `tickets`: where each problem is now tracked, problem → issue URL.
  let { ticket, tickets = {} }: { ticket: number; tickets?: Partial<Record<Problem, string>> } = $props();

  const split = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const issue = (url: string) => `#${url.split('/').pop()}`;
</script>

<p class="sum">
  <strong>{split.total}</strong> reports in #{ticket} ·
  <strong>{split.groups.length}</strong>
  {split.groups.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each split.groups as g (g.problem)}
      <tr class:open={!tickets[g.problem]}>
        <td><code>{g.problem}</code></td>
        <td>{g.reports}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>
          {#if tickets[g.problem]}<a href={tickets[g.problem]}>{issue(tickets[g.problem] ?? '')}</a>{:else}no ticket yet{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#each split.groups.filter((g) => g.filedUnder.length) as g (g.problem)}
  <p class="note">
    The {g.reports} <code>{g.problem}</code> reports are also counted under
    {#each g.filedUnder as cause, i (cause)}{i ? ', ' : ''}<code>{cause}</code>{/each}, where the desk files them by tenant.
  </p>
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
  .open td { background: var(--warn-bg); }
  .open td:last-child { color: var(--warn); font-weight: 600; }
</style>
