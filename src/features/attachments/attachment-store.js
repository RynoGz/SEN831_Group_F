// Narrow AttachmentStore adapter. All calls use the caller's authenticated client.
export function attachmentStore(client){
 const bucket=client.storage.from('request-attachments');
 return {
  async upload(key,bytes,type){const result=await bucket.upload(key,bytes,{contentType:type,upsert:false});if(result.error)throw new Error('Upload failed');},
  async remove(key){const result=await bucket.remove([key]);if(result.error||!result.data?.length)throw new Error('Cleanup failed');},
  async download(key){const result=await bucket.download(key);if(result.error)throw new Error('Download failed');return result.data;},
 };
}
export const MAX_ATTACHMENT_BYTES=5*1024*1024;
export function inspectAttachment(bytes,type){
 if(!bytes?.length||bytes.length>MAX_ATTACHMENT_BYTES)throw new Error('Choose a nonempty file up to 5 MiB.');
 const signatures={
  'application/pdf':()=>String.fromCharCode(...bytes.slice(0,5))==='%PDF-',
  'image/png':()=>[137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v),
  'image/jpeg':()=>bytes[0]===255&&bytes[1]===216&&bytes[2]===255,
 };
 if(!signatures[type]?.())throw new Error('Choose a PDF, PNG or JPEG with a matching file signature.');
 return {'application/pdf':'pdf','image/png':'png','image/jpeg':'jpg'}[type];
}
export async function uploadAttachment({store,client,requestId,key,bytes,type}){
 await store.upload(key,bytes,type);
 const result=await client.rpc('m3_link_attachment',{p_id:requestId,p_name:key});
 if(result.error){
  try{await store.remove(key);}catch{throw new Error('Linking failed and cleanup could not be confirmed. Contact support before retrying.');}
  throw new Error('The attachment could not be linked; the staged upload was removed.');
 }
}
