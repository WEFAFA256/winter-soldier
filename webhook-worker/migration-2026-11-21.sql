-- Serenity Spa booking/payment hardening migration (21 Nov 2026)
-- Safe to run more than once except the ALTER (see note below).

-- Cancelled/expired/failed bookings move here so their time slot is released
-- while staff keep a full audit trail.
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

-- Money taken after a booking was cancelled must be visible to staff.
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

-- Short-lived dedupe of authoritative PawaPay lookups triggered by callbacks.
CREATE TABLE IF NOT EXISTS callback_lookups (
  deposit_id TEXT PRIMARY KEY,
  checked_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT '',
  amount INTEGER
);

-- Allergies / special requests are currently collected but discarded.
ALTER TABLE bookings ADD COLUMN notes TEXT;
