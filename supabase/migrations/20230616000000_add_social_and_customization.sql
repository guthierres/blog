-- Adicionar colunas para personalização de cores na tabela site_config
ALTER TABLE site_config
ADD COLUMN primary_color TEXT DEFAULT '#3b82f6',
ADD COLUMN background_color TEXT DEFAULT '#ffffff',
ADD COLUMN text_color TEXT DEFAULT '#1f2937',
ADD COLUMN button_color TEXT DEFAULT '#3b82f6';

-- Criar tabela para redes sociais
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  site_config_id UUID NOT NULL REFERENCES site_config(id) ON DELETE CASCADE
);

-- Criar tabela para categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- Criar tabela para tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- Criar tabela de relação entre posts e categorias
CREATE TABLE post_categories (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Criar tabela de relação entre posts e tags
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Adicionar coluna de curtidas na tabela de posts
ALTER TABLE posts
ADD COLUMN likes INTEGER DEFAULT 0;

-- Criar tabela para armazenar as curtidas dos usuários
CREATE TABLE post_likes (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id, user_id)
);

-- Atualizar as políticas de segurança
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Políticas para social_links
CREATE POLICY "Anyone can view social links" ON social_links FOR SELECT USING (true);
CREATE POLICY "Only admins can manage social links" ON social_links USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Políticas para categories e tags
CREATE POLICY "Anyone can view categories and tags" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view categories and tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Only admins and moderators can manage categories and tags" ON categories USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND (users.role = 'admin' OR users.role = 'moderator')
  )
);
CREATE POLICY "Only admins and moderators can manage categories and tags" ON tags USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND (users.role = 'admin' OR users.role = 'moderator')
  )
);

-- Políticas para post_categories e post_tags
CREATE POLICY "Anyone can view post categories and tags" ON post_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view post categories and tags" ON post_tags FOR SELECT USING (true);
CREATE POLICY "Authors can manage their post categories and tags" ON post_categories USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_categories.post_id AND posts.author_id = auth.uid()
  )
);
CREATE POLICY "Authors can manage their post categories and tags" ON post_tags USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_tags.post_id AND posts.author_id = auth.uid()
  )
);

-- Políticas para post_likes
CREATE POLICY "Anyone can view post likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like posts" ON post_likes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can remove their own likes" ON post_likes FOR DELETE USING (auth.uid() = user_id);

