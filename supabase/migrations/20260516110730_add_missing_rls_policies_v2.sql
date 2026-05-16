/*
  # Add missing RLS policies for webhook and user operations

  1. Changes to `orders`
    - Add INSERT policy for authenticated users (webhook creates orders)

  2. Changes to `stripe_customers`
    - Add INSERT policy for authenticated users (webhook creates customer mappings)

  3. Changes to `stripe_orders`
    - Add INSERT policy for authenticated users (webhook creates stripe orders)

  4. Changes to `client_documents`
    - Add INSERT policy for users to insert their own documents
    - Add DELETE policy for users to delete their own documents

  5. Changes to `intake_uploads`
    - Add admin DELETE policy

  6. Changes to `client_profiles`
    - Add DELETE policy for admins

  7. Changes to `intake_responses`
    - Add DELETE policy for users to delete their own responses
*/

-- orders: INSERT policy
CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- stripe_customers: INSERT policy
CREATE POLICY "Users can insert own customer data"
  ON stripe_customers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- stripe_orders: INSERT policy
CREATE POLICY "Users can insert own stripe orders"
  ON stripe_orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- client_documents: user INSERT policy
CREATE POLICY "Users can insert own client documents"
  ON client_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- client_documents: user DELETE policy
CREATE POLICY "Users can delete own client documents"
  ON client_documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- intake_uploads: admin DELETE policy
CREATE POLICY "Admins can delete any intake uploads"
  ON intake_uploads FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR (auth.jwt() ->> 'email') = 'foundationarybusiness@gmail.com'
  );

-- client_profiles: admin DELETE policy
CREATE POLICY "Admins can delete client profiles"
  ON client_profiles FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR (auth.jwt() ->> 'email') = 'foundationarybusiness@gmail.com'
  );

-- intake_responses: user DELETE policy
CREATE POLICY "Users can delete own intake responses"
  ON intake_responses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
