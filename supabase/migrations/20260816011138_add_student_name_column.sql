/*
# Add student name column to student_progress

1. Modified Tables
- `student_progress` gains a `full_name` text column to store the student's display name.
- The column is nullable so existing rows remain valid; new students will always provide a name.
2. Security
- No policy changes. Existing anon/authenticated CRUD policies already cover the new column.
3. Notes
- The `id` column (text primary key) is the unique per-student identifier generated in the browser.
- Each student's progress is stored in a separate row keyed by that unique id, so students cannot see or modify each other's data.
*/

ALTER TABLE student_progress
  ADD COLUMN IF NOT EXISTS full_name text;
