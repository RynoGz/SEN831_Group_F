"use client";
import {useState} from 'react';
export default function AttachmentUpload({requestId,onSaved}){
 const [pending,setPending]=useState(false);const [message,setMessage]=useState('');
 async function upload(event){event.preventDefault();setPending(true);setMessage('');
  try{const r=await fetch(`/api/requests/${requestId}/attachment`,{method:'POST',body:new FormData(event.currentTarget)});const data=await r.json();if(!r.ok)throw new Error(data.error);setMessage('Attachment saved.');onSaved?.();}catch(e){setMessage(e.message||'Upload failed.');}finally{setPending(false);}
 }
 return <form className="panel" onSubmit={upload}><h2>Add an optional attachment</h2><p>One PDF, PNG or JPEG, up to 5 MiB. Your request is already saved; an upload failure does not remove it.</p><label htmlFor="attachment-file">File<input id="attachment-file" name="file" type="file" accept="application/pdf,image/png,image/jpeg" required disabled={pending}/></label><button className="button" disabled={pending}>{pending?'Uploading…':'Upload attachment'}</button><p role="status">{message}</p></form>;
}
