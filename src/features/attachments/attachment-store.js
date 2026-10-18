// Narrow AttachmentStore adapter. All calls use the caller's authenticated client.
export function attachmentStore(client) {
  const bucket = client.storage.from('request-attachments');
  return {
    async upload(key, bytes, type) {
      const result = await bucket.upload(key, bytes, {
        contentType: type,
        upsert: false
      });
      if (result.error) throw new Error('Upload failed');
    },
    async remove(key) {
      const result = await bucket.remove([key]);
      if (result.error || !result.data?.length) throw new Error('Cleanup failed');
    },
    async download(key) {
      const result = await bucket.download(key);
      if (result.error) throw new Error('Download failed');
      return result.data;
    }
  };
}
export const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;
// Reserve bounded multipart overhead below the hosting function's payload ceiling.
const MAX_UPLOAD_BODY_BYTES = MAX_ATTACHMENT_BYTES + 65536;
const sizeMessage = `Choose a nonempty file up to ${MAX_ATTACHMENT_BYTES / (1024 * 1024)} MiB.`;
export class AttachmentValidationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
export async function readAttachmentFile(request) {
  if (Number(request.headers.get('content-length')) > MAX_UPLOAD_BODY_BYTES) throw new AttachmentValidationError(sizeMessage, 413);
  if (!request.body) throw new AttachmentValidationError('Choose a file.');
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const {
        done,
        value
      } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_UPLOAD_BODY_BYTES) {
        await reader.cancel();
        throw new AttachmentValidationError(sizeMessage, 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  let form;
  try {
    form = await new Response(new Blob(chunks), {
      headers: {
        'content-type': request.headers.get('content-type') ?? ''
      }
    }).formData();
  } catch {
    throw new AttachmentValidationError('Choose a valid multipart file upload.');
  }
  const file = form.get('file');
  if (!(file instanceof File)) throw new AttachmentValidationError('Choose a file.');
  if (file.size > MAX_ATTACHMENT_BYTES) throw new AttachmentValidationError(sizeMessage, 413);
  if (!file.size) throw new AttachmentValidationError(sizeMessage);
  return file;
}
export function inspectAttachment(bytes, type) {
  if (!bytes?.length || bytes.length > MAX_ATTACHMENT_BYTES) throw new Error(sizeMessage);
  const signatures = {
    'application/pdf': () => String.fromCharCode(...bytes.slice(0, 5)) === '%PDF-',
    'image/png': () => [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v),
    'image/jpeg': () => bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
  };
  if (!signatures[type]?.()) throw new Error('Choose a PDF, PNG or JPEG with a matching file signature.');
  return {
    'application/pdf': 'pdf',
    'image/png': 'png',
    'image/jpeg': 'jpg'
  }[type];
}
export async function uploadAttachment({
  store,
  client,
  requestId,
  key,
  bytes,
  type
}) {
  await store.upload(key, bytes, type);
  try {
    const result = await client.rpc('m3_link_attachment', {
      p_id: requestId,
      p_name: key
    });
    if (result.error) throw new Error('Link failed');
  } catch {
    try {
      await store.remove(key);
    } catch {
      throw new Error('Linking failed and cleanup could not be confirmed. Contact support before retrying.');
    }
    throw new Error('The attachment could not be linked; the staged upload was removed.');
  }
}
