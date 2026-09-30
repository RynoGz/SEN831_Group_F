export const REQUEST_STATUSES = Object.freeze([
  "Submitted",
  "Accepted",
  "Assigned",
  "In Progress",
  "Resolved",
  "Closed",
  "Rejected",
]);

const knownStatuses = new Set(REQUEST_STATUSES);

const allowedTransitions = new Map([
  ["Submitted", new Set(["Accepted", "Rejected"])],
  ["Accepted", new Set(["Assigned"])],
  ["Assigned", new Set(["In Progress"])],
  ["In Progress", new Set(["Resolved"])],
  ["Resolved", new Set(["Closed"])],
]);

export function canTransition(currentStatus, newStatus) {
  if (!knownStatuses.has(currentStatus) || !knownStatuses.has(newStatus)) {
    return false;
  }

  if (currentStatus === newStatus) {
    return false;
  }

  return allowedTransitions.get(currentStatus)?.has(newStatus) ?? false;
}

export function assertTransitionAllowed(currentStatus, newStatus) {
  if (!knownStatuses.has(currentStatus)) {
    throw new TypeError(`Unknown current request status: ${String(currentStatus)}`);
  }

  if (!knownStatuses.has(newStatus)) {
    throw new TypeError(`Unknown new request status: ${String(newStatus)}`);
  }

  if (!canTransition(currentStatus, newStatus)) {
    throw new Error(
      `Request transition from ${currentStatus} to ${newStatus} is not allowed.`,
    );
  }
}
