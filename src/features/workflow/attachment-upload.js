"use client";

import { useRef, useState } from 'react';
import { MAX_ATTACHMENT_BYTES } from '@/features/attachments/attachment-store';
import { readApiResponse } from './api-response';

export default function AttachmentUpload({ requestId, onSaved }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const [saved, setSaved] = useState(false);
  const inFlight = useRef(false);
  const limitMiB = MAX_ATTACHMENT_BYTES / (1024 * 1024);

  async function upload(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (inFlight.current || !form.reportValidity()) return;
    const body = new FormData(form);
    const file = body.get('file');
    setFailed(false);
    if (!file?.size || file.size > MAX_ATTACHMENT_BYTES) {
      setFailed(true); setMessage(`Choose a nonempty file up to ${limitMiB} MiB.`); return;
    }
    if (!['application/pdf', 'image/png', 'image/jpeg'].includes(file.type)) {
      setFailed(true); setMessage('Choose a PDF, PNG or JPEG.'); return;
    }
    inFlight.current = true; setPending(true); setMessage('');
    try {
      const response = await fetch(`/api/requests/${requestId}/attachment`, { method: 'POST', body });
      const result = await readApiResponse(response);
      if (result?.ok !== true) throw new Error('The upload could not be confirmed. Reload the request before trying again.');
      setSaved(true); setMessage('Attachment saved.'); onSaved?.();
    } catch (error) {
      setFailed(true);
      setMessage(error.message || 'The upload could not be confirmed. Reload the request before trying again.');
    } finally { inFlight.current = false; setPending(false); }
  }

  if (saved) return <p role="status">Attachment saved.</p>;
  return <form className="panel attachment-form" onSubmit={upload} noValidate aria-busy={pending}>
    <h2>Add an optional attachment</h2>
    <p>One PDF, PNG or JPEG, up to {limitMiB} MiB. Your request is already saved; an upload failure does not remove it.</p>
    <label htmlFor="attachment-file">File<input id="attachment-file" name="file" type="file" accept="application/pdf,image/png,image/jpeg" required disabled={pending}/></label>
    <button className="button" disabled={pending}>{pending ? 'Uploading…' : 'Upload attachment'}</button>
    <p role={failed ? 'alert' : 'status'}>{message}</p>
  </form>;
}
