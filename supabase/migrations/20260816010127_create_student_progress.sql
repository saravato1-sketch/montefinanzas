/*
# Create student progress storage

1. New Tables
- `student_progress` stores the single student's educational progress, score, streak, badges, and simulator snapshot.
- `id` is the stable browser profile key.
- `payload` stores the JSON progress document so the learning experience can evolve without losing existing data.
- `updated_at` records the latest save.
2. Security
- Row level security is enabled.
- This is an intentionally no-login educational experience, so the anon and authenticated roles can read and update the shared app profile.
3. Notes
- The browser still keeps a local copy for instant interaction and offline resilience.
- The database copy synchronizes when available and never blocks the learning experience.
*/

CREATE TABLE IF NOT EXISTS student_progress (
  id text PRIMARY KEY,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_student_progress" ON student_progress;
CREATE POLICY "anon_read_student_progress" ON student_progress FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_student_progress" ON student_progress;
CREATE POLICY "anon_insert_student_progress" ON student_progress FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_student_progress" ON student_progress;
CREATE POLICY "anon_update_student_progress" ON student_progress FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_student_progress" ON student_progress;
CREATE POLICY "anon_delete_student_progress" ON student_progress FOR DELETE
TO anon, authenticated USING (true);
