-- Storage policies for intake-uploads bucket
CREATE POLICY "users_upload_own_intake" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (
    bucket_id = 'intake-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "users_read_own_intake" ON storage.objects FOR SELECT
  TO authenticated USING (
    bucket_id = 'intake-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "users_delete_own_intake" ON storage.objects FOR DELETE
  TO authenticated USING (
    bucket_id = 'intake-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for generated-documents bucket
CREATE POLICY "users_read_own_documents" ON storage.objects FOR SELECT
  TO authenticated USING (
    bucket_id = 'generated-documents' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "admin_all_documents_storage" ON storage.objects FOR ALL
  TO authenticated USING (
    bucket_id = 'generated-documents' AND
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

-- Storage policies for user-uploads bucket
CREATE POLICY "users_upload_own_uploads" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (
    bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "users_read_own_uploads" ON storage.objects FOR SELECT
  TO authenticated USING (
    bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "admin_all_uploads_storage" ON storage.objects FOR ALL
  TO authenticated USING (
    bucket_id = 'user-uploads' AND
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );
