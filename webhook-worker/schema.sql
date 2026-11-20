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
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  confirmed_at TEXT,
  UNIQUE (booking_date, booking_time)
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(customer_phone);

CREATE TABLE IF NOT EXISTS payment_events (
  id TEXT PRIMARY KEY,
  deposit_id TEXT,
  status TEXT,
  raw_body TEXT NOT NULL,
  received_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_events_deposit ON payment_events(deposit_id);
