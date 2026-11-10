-- Dades personals: accés privat; no exposar en cap endpoint públic.
CREATE TABLE IF NOT EXISTS financing_requests (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  status TEXT NOT NULL DEFAULT 'received' CHECK(status IN ('received','review','information_sent','contact_pending','proposal','documents','formalization_pending','formalized','discarded','cancelled','repaying','closed')),
  mode TEXT NOT NULL CHECK(mode IN ('loan','member','undecided')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  locality TEXT,
  preferred_language TEXT NOT NULL CHECK(preferred_language IN ('ca','es')),
  amount_eur INTEGER NOT NULL,
  preferences_json TEXT NOT NULL,
  comment TEXT,
  newsletter_consent INTEGER NOT NULL DEFAULT 0 CHECK(newsletter_consent IN (0,1)),
  notice_acknowledged INTEGER NOT NULL CHECK(notice_acknowledged = 1),
  transfer_acknowledged INTEGER NOT NULL CHECK(transfer_acknowledged = 1),
  privacy_notice_version TEXT NOT NULL DEFAULT '2026-11',
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_finance_created ON financing_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_finance_mode_status ON financing_requests(mode,status);
