-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create users table with UUID
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  birth_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user preferences table with UUID
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  has_pet_experience BOOLEAN NOT NULL,
  has_allergies BOOLEAN NOT NULL,
  living_space VARCHAR(100) NOT NULL,
  pet_spending VARCHAR(100) NOT NULL,
  time_commitment VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS saved_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  pet_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  gender TEXT,
  discription TEXT,
  kids_friendly BOOLEAN,
  city TEXT,
  adoption_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  age TEXT,
  coat_length TEXT,
  size TEXT
);

CREATE TABLE IF NOT EXISTS pet_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL,
  url TEXT NOT NULL,
  is_main BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL,
  pet_id UUID NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT chk_application_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

--foreign keys
ALTER TABLE applications
  ADD CONSTRAINT fk_applications_applicant FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE applications
  ADD CONSTRAINT fk_applications_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE;
  
ALTER TABLE pet_photos
  ADD CONSTRAINT fk_photos_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE;
  
ALTER TABLE pets
  ADD CONSTRAINT fk_pets_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;
  
ALTER TABLE saved_publications
  ADD CONSTRAINT fk_saved_publications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE saved_publications
  ADD CONSTRAINT fk_saved_publications_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE;

ALTER TABLE user_preferences
  ADD CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


