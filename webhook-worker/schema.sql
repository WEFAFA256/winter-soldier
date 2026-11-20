-- Serenity Spa booking + payment ledger (Cloudflare D1)
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  price_ugx INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  deposit_id TEXT NOT NULL UNIQUE,
  service_id TEXT NOT NULL,
  service_title TEXT NOT NULL,
  amount_ugx INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  booking_date TEXT NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
  checkout_url TEXT,
  notes TEXT,
  payment_provider TEXT,
  payment_phone TEXT,
  deposit_initiated_at TEXT,
  status_check_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  confirmed_at TEXT,
  UNIQUE (booking_date, booking_time)
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(customer_phone);

-- Cancelling/expiring a booking moves the row here and DELETES it from
-- `bookings`, so the UNIQUE(date,time) slot is genuinely released.
CREATE TABLE IF NOT EXISTS bookings_archive (
  id TEXT PRIMARY KEY,
  deposit_id TEXT,
  service_id TEXT,
  service_title TEXT,
  amount_ugx INTEGER,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  booking_date TEXT,
  booking_time TEXT,
  status TEXT NOT NULL,
  notes TEXT,
  payment_provider TEXT,
  payment_phone TEXT,
  deposit_initiated_at TEXT,
  status_check_at TEXT,
  created_at TEXT,
  updated_at TEXT,
  confirmed_at TEXT,
  cancelled_at TEXT,
  cancel_reason TEXT
);
CREATE INDEX IF NOT EXISTS idx_bookings_archive_date ON bookings_archive(booking_date, booking_time);
CREATE INDEX IF NOT EXISTS idx_bookings_archive_status ON bookings_archive(status);
CREATE INDEX IF NOT EXISTS idx_bookings_archive_deposit ON bookings_archive(deposit_id);

-- Verified PawaPay outcomes (authoritative status lookups only).
CREATE TABLE IF NOT EXISTS payment_events (
  id TEXT PRIMARY KEY,
  deposit_id TEXT,
  status TEXT,
  raw_body TEXT NOT NULL,
  received_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_payment_events_deposit ON payment_events(deposit_id);

-- Money confirmed after a cancellation: staff must refund it manually.
CREATE TABLE IF NOT EXISTS refunds (
  id TEXT PRIMARY KEY,
  deposit_id TEXT NOT NULL UNIQUE,
  booking_id TEXT,
  amount_ugx INTEGER NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING_REFUND',
  created_at TEXT NOT NULL,
  refunded_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);

-- 30-second dedupe of authoritative PawaPay lookups triggered by callbacks.
CREATE TABLE IF NOT EXISTS callback_lookups (
  deposit_id TEXT PRIMARY KEY,
  checked_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT '',
  amount INTEGER
);

-- Per-IP booking throttles (10-minute buckets). Old rows are pruned on each create.
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  window_start TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0
);
