-- W1: bound new uploads to 4 MiB for the existing function-based upload contract.
-- Independent of migration 009. Existing objects and their access policies are retained.
update storage.buckets
set file_size_limit=4194304,public=false
where id='request-attachments';
