-- Failed payments archive their booking to free the slot. Keep the authoritative
-- PawaPay failure reason so the status endpoint can tell the customer what
-- actually happened instead of returning "Booking not found".
CREATE TABLE IF NOT EXISTS payment_failures (
  booking_id TEXT PRIMARY KEY,
  deposit_id TEXT,
  failure_code TEXT,
  failure_message TEXT,
  created_at TEXT
);

-- Applied to the remote D1 database `serenity-spa` on 2026-11-21.
