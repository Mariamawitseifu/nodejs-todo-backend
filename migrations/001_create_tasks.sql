CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  title VARCHAR,
  description TEXT,
  notes TEXT,
  date DATE,
  time TIME,
  duration INTEGER,
  category_id INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  create_date TIMESTAMP DEFAULT NOW(),
  modify_date TIMESTAMP DEFAULT NOW()
);
