-- Executar una sola vegada sobre la D1 existent.
-- Afig seguiment dels avisos; no altera les sol·licituds ja guardades.
ALTER TABLE financing_requests ADD COLUMN notification_status TEXT NOT NULL DEFAULT 'pending'
  CHECK(notification_status IN ('pending','sent','failed','not_configured'));
ALTER TABLE financing_requests ADD COLUMN notification_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE financing_requests ADD COLUMN notification_sent_at TEXT;
ALTER TABLE financing_requests ADD COLUMN notification_provider_id TEXT;
CREATE INDEX IF NOT EXISTS idx_financing_notification_status ON financing_requests(notification_status);
