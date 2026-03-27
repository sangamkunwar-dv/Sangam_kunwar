-- Seed initial data for portfolio

-- Insert sample projects
INSERT INTO projects (title, description, tech_stack, links) VALUES
('Portfolio Website', 'Modern portfolio showcasing projects and collaborations', ARRAY['Next.js', 'React', 'Tailwind CSS'], '[{"label": "Live", "url": "https://example.com"}]'),
('E-commerce Platform', 'Full-stack e-commerce solution with payment integration', ARRAY['Node.js', 'MongoDB', 'React'], '[{"label": "GitHub", "url": "https://github.com"}]'),
('Analytics Dashboard', 'Data visualization dashboard with interactive charts', ARRAY['Next.js', 'Recharts', 'Supabase'], '[{"label": "Live", "url": "https://example.com"}]');

-- Insert sample events
INSERT INTO events (title, description, date, location, event_type) VALUES
('Web Development Workshop', 'Learn modern web development with Next.js and React', '2024-12-15', 'Kathmandu, Nepal', 'workshop'),
('Tech Conference 2024', 'Annual tech conference featuring industry leaders', '2024-11-20', 'Pokhara, Nepal', 'conference'),
('Meetup: Full Stack Development', 'Monthly meetup for full stack developers', '2024-10-25', 'Tilottama, Nepal', 'meetup');

-- Insert sample collaborators
INSERT INTO collaborators (name, role, bio, social_links) VALUES
('John Doe', 'Frontend Developer', 'Passionate about building beautiful UIs', '{"github": "https://github.com", "linkedin": "https://linkedin.com"}'),
('Jane Smith', 'Backend Developer', 'Expert in Node.js and databases', '{"github": "https://github.com", "linkedin": "https://linkedin.com"}');
