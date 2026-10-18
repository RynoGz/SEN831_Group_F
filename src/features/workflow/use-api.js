"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { readApiResponse } from './api-response';

export function useApi(url, { retainPreviousData = false } = {}) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState({ url: null, revision: -1, data: null, error: null, status: null });
  const reload = useCallback(() => setRevision(value => value + 1), []);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    let active = true;
    fetch(url, { signal: controller.signal, cache: 'no-store' })
      .then(readApiResponse)
      .then(data => {
        if (active) setResult({ url, revision, data, error: null, status: null });
      })
      .catch(error => {
        if (active && error.name !== 'AbortError') {
          setResult({ url, revision, data: null, error: error.message, status: error.status });
        }
      });
    return () => { active = false; controller.abort(); };
  }, [url, revision]);

  const loading = Boolean(url) && (result.url !== url || result.revision !== revision);
  return {
    loading,
    data: url && (result.url === url || (retainPreviousData && result.url?.split('?')[0] === url.split('?')[0])) ? result.data : null,
    error: url && !loading ? result.error : null,
    status: url && !loading ? result.status : null,
    reload,
  };
}

export function ApiState({ state }) {
  const pathname = usePathname();
  if (state.loading) return <p role="status">{state.data ? 'Refreshing…' : 'Loading…'}</p>;
  if (!state.error) return null;
  return <div className="feedback error-feedback" role="alert">
    <p>{state.error}</p>
    {state.status === 401
      ? <Link className="text-link" href={`/auth/login?next=${encodeURIComponent(pathname)}`}>Sign in again</Link>
      : <button className="nav-button" type="button" onClick={state.reload}>Try again</button>}
  </div>;
}

export const displayTime = value => value
  ? new Date(value).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' }) + ' SAST'
  : 'Not set';
