// CR-M3-01: first assignment and retaining the same assignee do not require a reason.
export function assignmentReasonError(currentAssignee, assignedTo, note) {
  if (note != null && typeof note !== 'string') return 'Enter a valid assignment note.';
  const reason = note?.trim() ?? '';
  if (reason.length > 4000) return 'Keep the assignment reason to 4000 characters or fewer.';
  if (currentAssignee && assignedTo !== currentAssignee && !reason) {
    return 'Enter a reason for changing the responsible staff member.';
  }
  return null;
}
