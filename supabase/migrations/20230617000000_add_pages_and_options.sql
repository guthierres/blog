-- Criar tabela para páginas
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  allow_comments BOOLEAN NOT NULL DEFAULT true,
  position TEXT NOT NULL DEFAULT 'footer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar coluna para permitir comentários em posts
ALTER TABLE posts
ADD COLUMN allow_comments BOOLEAN NOT NULL DEFAULT true;

-- Atualizar as políticas de segurança
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Políticas para pages
CREATE POLICY "Anyone can view published pages" ON pages
FOR SELECT USING (true);

CREATE POLICY "Admins can manage pages" ON pages
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp de páginas
CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON pages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

