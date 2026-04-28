ALTER TABLE submissions RENAME TO submissions_backup;

CREATE TABLE applicants (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text UNIQUE NOT NULL,
  phone      text,
  instagram  text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE submissions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid NOT NULL REFERENCES applicants(id),
  car_make     text NOT NULL,
  car_model    text NOT NULL,
  car_year     integer NOT NULL,
  questions    text,
  status       text NOT NULL DEFAULT 'pending',
  submitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE photos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  url           text NOT NULL,
  uploaded_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reviews (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid UNIQUE NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  seen          boolean NOT NULL DEFAULT false,
  notes         text
);

CREATE TABLE payments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid UNIQUE NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  status        text NOT NULL DEFAULT 'unpaid',
  amount        integer,
  paid_at       timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

INSERT INTO applicants (name, email, phone, instagram, created_at)
SELECT DISTINCT ON (email)
  name, email, phone, instagram, submitted_at AS created_at
FROM submissions_backup
ORDER BY email, submitted_at ASC;

INSERT INTO submissions (id, applicant_id, car_make, car_model, car_year, questions, status, submitted_at)
SELECT
  b.id,
  a.id AS applicant_id,
  b.car_make,
  b.car_model,
  b.car_year,
  b.questions,
  COALESCE(b.status, 'pending') AS status,
  b.submitted_at
FROM submissions_backup b
JOIN applicants a ON a.email = b.email;

INSERT INTO photos (submission_id, url, uploaded_at)
SELECT b.id, unnest(b.photo_urls), b.submitted_at
FROM submissions_backup b;

INSERT INTO reviews (submission_id, seen, notes)
SELECT id, COALESCE(seen, false), notes
FROM submissions_backup;

INSERT INTO payments (submission_id, status, amount, paid_at, created_at)
SELECT
  id AS submission_id,
  'paid' AS status,
  4200 AS amount,
  paid_at,
  submitted_at AS created_at
FROM submissions_backup
WHERE payment_status = 'paid';

-- ============================================================
-- Verify row counts before dropping the backup:
--   SELECT COUNT(*) FROM submissions_backup;
--   SELECT COUNT(*) FROM submissions;
--   SELECT COUNT(*) FROM applicants;
--   SELECT COUNT(*) FROM photos;
--   SELECT COUNT(*) FROM reviews;
--   SELECT COUNT(*) FROM payments;
--
-- When satisfied: DROP TABLE submissions_backup;
-- ============================================================
