export default function StatusBadge({ status, overdue = false }) {
  const variant = status === 'In Progress' ? 'status-progress' : status === 'Submitted' ? 'status-submitted' : '';
  return <span className={`status-badge ${variant}`}>{status || 'Unknown'}{overdue && ' · Overdue'}</span>;
}
