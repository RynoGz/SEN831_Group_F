import { createSupabaseServerClient } from '@/lib/supabase/server';
import { detail, WorkflowError } from '@/features/workflow/service';
import { failure, sameOrigin } from '@/features/workflow/http';
import { attachmentStore, inspectAttachment, uploadAttachment, readAttachmentFile, AttachmentValidationError } from '@/features/attachments/attachment-store';
export const runtime = 'nodejs';
export async function POST(request, {
  params
}) {
  try {
    sameOrigin(request);
    const client = await createSupabaseServerClient();
    const id = (await params).requestId;
    const {
      request: row
    } = await detail(client, id);
    const {
      data: owned,
      error
    } = await client.rpc('m3_is_owner', {
      p_id: id
    });
    if (error || !owned) throw new WorkflowError('Upload not permitted.', 403);
    if (row.attachment_reference) throw new WorkflowError('This request already has an attachment.', 409);
    let file;
    try {
      file = await readAttachmentFile(request);
    } catch (e) {
      if (e instanceof AttachmentValidationError) throw new WorkflowError(e.message, e.status);
      throw e;
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    let extension;
    try {
      extension = inspectAttachment(bytes, file.type);
    } catch (e) {
      throw new WorkflowError(e.message);
    }
    const key = `${id}/${crypto.randomUUID()}.${extension}`;
    try {
      await uploadAttachment({
        store: attachmentStore(client),
        client,
        requestId: id,
        key,
        bytes,
        type: file.type
      });
    } catch (e) {
      throw new WorkflowError(e.message, 503);
    }
    return Response.json({
      ok: true
    });
  } catch (e) {
    return failure(e);
  }
}
export async function GET(request, {
  params
}) {
  try {
    const client = await createSupabaseServerClient();
    const {
      request: row
    } = await detail(client, (await params).requestId);
    if (!row.attachment_reference) throw new WorkflowError('No attachment is available.', 404);
    const blob = await attachmentStore(client).download(row.attachment_reference);
    const extension = row.attachment_reference.split('.').pop();
    return new Response(blob, {
      headers: {
        'Content-Type': blob.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="request-attachment.${extension}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (e) {
    return failure(e);
  }
}
