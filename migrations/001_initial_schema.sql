-- Migração 001: Esquema Inicial do NexoJuris
-- Contas, Grafo de Conhecimento, Passagens e Estudos

CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(50) PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1. Usuários e Contas
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid VARCHAR(128) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL DEFAULT 'free', -- 'free', 'estudante', 'profissional'
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'paused', 'canceled'
  mp_preapproval_id VARCHAR(100),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL, -- 'grant', 'reserve', 'settle', 'refund'
  amount INT NOT NULL,
  balance_after INT NOT NULL,
  reference_id VARCHAR(100), -- ID do estudo ou pagamento
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_ledger_user ON credit_ledger(user_id, created_at DESC);

-- 2. Acervo e Grafo Jurídico de Conhecimento
CREATE TABLE IF NOT EXISTS source_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hash_sha256 VARCHAR(64) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  kind VARCHAR(50) NOT NULL, -- 'doctrine', 'law', 'case'
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS source_passages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES source_documents(id) ON DELETE CASCADE,
  locator_section VARCHAR(255) NOT NULL,
  line_start INT,
  line_end INT,
  text_content TEXT NOT NULL,
  search_tsv TSVECTOR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_source_passages_doc ON source_passages(document_id);
CREATE INDEX IF NOT EXISTS idx_source_passages_tsv ON source_passages USING GIN(search_tsv);

CREATE TABLE IF NOT EXISTS legal_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_id VARCHAR(100) NOT NULL UNIQUE, -- Ex: 'BR:CF:1988:art5:inc36', 'instituto:coisa-julgada'
  kind VARCHAR(50) NOT NULL, -- 'device', 'concept', 'question'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_legal_entities_canonical ON legal_entities(canonical_id);

CREATE TABLE IF NOT EXISTS legal_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_entity_id UUID NOT NULL REFERENCES legal_entities(id) ON DELETE CASCADE,
  target_entity_id UUID NOT NULL REFERENCES legal_entities(id) ON DELETE CASCADE,
  passage_id UUID REFERENCES source_passages(id) ON DELETE SET NULL,
  relation_type VARCHAR(50) NOT NULL, -- 'governed_by', 'comments_on', 'mentions', 'interprets', 'official_annotation', 'supports', 'opposes', 'changes_position'
  evidence_text TEXT,
  method VARCHAR(50) NOT NULL DEFAULT 'explicit_reference', -- 'official_import', 'explicit_reference', 'editorial'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_legal_relations_source ON legal_relations(source_entity_id);
CREATE INDEX IF NOT EXISTS idx_legal_relations_target ON legal_relations(target_entity_id);

-- 3. Estudos Gerados e Histórico
CREATE TABLE IF NOT EXISTS studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  objective VARCHAR(50) NOT NULL DEFAULT 'compreender', -- 'compreender', 'comparar_doutrina', 'comparar_jurisprudencia', 'aplicar'
  model_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'completed', -- 'queued', 'running', 'completed', 'failed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_studies_user ON studies(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS study_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_id UUID NOT NULL REFERENCES studies(id) ON DELETE CASCADE,
  order_index INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content_markdown TEXT NOT NULL,
  referenced_passages JSONB NOT NULL DEFAULT '[]'
);

CREATE INDEX IF NOT EXISTS idx_study_sections_study ON study_sections(study_id, order_index);

CREATE TABLE IF NOT EXISTS study_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_id UUID NOT NULL REFERENCES studies(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- 'law', 'doctrine', 'case', 'concept'
  label VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  source_ref VARCHAR(255),
  passage_id UUID REFERENCES source_passages(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_study_connections_study ON study_connections(study_id);
