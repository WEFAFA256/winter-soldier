-- Direct (on-page) MTN/Airtel deposits: store which wallet was used, when the
-- provider prompt was sent, and when we last asked PawaPay for a status.
ALTER TABLE bookings ADD COLUMN payment_provider TEXT;
ALTER TABLE bookings ADD COLUMN payment_phone TEXT;
ALTER TABLE bookings ADD COLUMN deposit_initiated_at TEXT;
ALTER TABLE bookings ADD COLUMN status_check_at TEXT;
