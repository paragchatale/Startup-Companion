/*
  # Drop documents table and cleanup

  1. Drop Table
    - Remove `documents` table completely
    - This will automatically remove foreign key constraints
  
  2. Cleanup
    - Remove all associated indexes and policies
    - Clean database structure
*/

-- Drop the documents table (this will also drop foreign key constraints automatically)
DROP TABLE IF EXISTS documents CASCADE;