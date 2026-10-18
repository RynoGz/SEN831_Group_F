export function signInDestination(role, next) {
  const fallback = role === 'manager' ? '/management' : role === 'staff' ? '/work' : '/requests';
  if (typeof next !== 'string') return fallback;
  if (/^\/requests(?:\/new|\/[0-9a-f-]{36})?$/.test(next)) return next;
  if (next === '/work' && ['staff', 'manager'].includes(role)) return next;
  if (next === '/management' && role === 'manager') return next;
  return fallback;
}
