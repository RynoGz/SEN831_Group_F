const terminal = new Set(['Resolved', 'Closed', 'Rejected']);
export function isOverdue(request, now = Date.now()) {
  const target = Date.parse(request.target_at);
  return Number.isFinite(target) && target < now && !terminal.has(request.statuses?.name);
}
