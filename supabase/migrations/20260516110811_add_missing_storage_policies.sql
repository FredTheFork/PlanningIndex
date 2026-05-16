/*
  # Add missing storage policies

  1. Users can upload to client-documents bucket
  2. Users can delete from intake-uploads bucket
  3. Users can delete from client-documents bucket
*/

-- Users can upload to client-documents (for their own folder)
CREATE POLICY "Users can upload own client documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'client-documents'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- Users can delete from intake-uploads (their own files)
CREATE POLICY "Users can delete own intake files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'intake-uploads'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- Users can delete from client-documents (their own files)
CREATE POLICY "Users can delete own client documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'client-documents'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );
