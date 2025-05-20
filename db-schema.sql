-- Create pets table if it doesn't exist
CREATE TABLE IF NOT EXISTS pets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  breed VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL,
  age VARCHAR(50) NOT NULL,
  age_category VARCHAR(20) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  size VARCHAR(20) NOT NULL,
  coat_length VARCHAR(20) NOT NULL,
  good_with_kids VARCHAR(5) NOT NULL,
  location VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  days_on_platform INTEGER NOT NULL,
  adoption_type VARCHAR(20) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data if the table is empty
INSERT INTO pets (name, breed, species, age, age_category, gender, size, coat_length, good_with_kids, location, city, days_on_platform, adoption_type, image_url)
SELECT * FROM (
  VALUES
    ('Max', 'Labrador', 'Dog', '2 years', 'Young', 'Male', 'Large', 'Short', 'Yes', 'New York, NY', 'New York, NY', 15, 'Permanent', '/labrador.png'),
    ('Bella', 'German Shepherd', 'Dog', '1 year', 'Young', 'Female', 'Large', 'Medium', 'Yes', 'Los Angeles, CA', 'Los Angeles, CA', 7, 'Permanent', '/majestic-german-shepherd.png'),
    ('Charlie', 'Golden Retriever', 'Dog', '3 years', 'Adult', 'Male', 'Large', 'Medium', 'Yes', 'Chicago, IL', 'Chicago, IL', 30, 'Permanent', '/golden-retriever.png'),
    ('Luna', 'Beagle', 'Dog', '2 years', 'Young', 'Female', 'Medium', 'Short', 'Yes', 'Houston, TX', 'Houston, TX', 45, 'Permanent', '/beagle-portrait.png'),
    ('Cooper', 'Bulldog', 'Dog', '4 years', 'Adult', 'Male', 'Medium', 'Short', 'Yes', 'Phoenix, AZ', 'Phoenix, AZ', 60, 'Permanent', '/happy-bulldog.png'),
    ('Lucy', 'Poodle', 'Dog', '1 year', 'Young', 'Female', 'Small', 'Long', 'Yes', 'Philadelphia, PA', 'Philadelphia, PA', 5, 'Permanent', '/fluffy-white-poodle.png'),
    ('Bailey', 'Siberian Husky', 'Dog', '3 years', 'Adult', 'Female', 'Large', 'Medium', 'Yes', 'San Antonio, TX', 'San Antonio, TX', 20, 'Temporary', '/siberian-husky-portrait.png'),
    ('Rocky', 'Boxer', 'Dog', '5 years', 'Adult', 'Male', 'Large', 'Short', 'No', 'San Diego, CA', 'San Diego, CA', 100, 'Permanent', '/boxer-dog.png'),
    ('Daisy', 'Dachshund', 'Dog', '2 years', 'Young', 'Female', 'Small', 'Short', 'Yes', 'Dallas, TX', 'Dallas, TX', 12, 'Permanent', '/dachshund-in-garden.png'),
    ('Whiskers', 'Siamese', 'Cat', '3 years', 'Adult', 'Male', 'Medium', 'Short', 'Yes', 'New York, NY', 'New York, NY', 25, 'Permanent', '/siamese-cat.png'),
    ('Mittens', 'Maine Coon', 'Cat', '4 years', 'Adult', 'Female', 'Large', 'Long', 'Yes', 'Chicago, IL', 'Chicago, IL', 40, 'Permanent', '/maine-coon-cat.png'),
    ('Tweety', 'Budgerigar', 'Bird', '1 year', 'Young', 'Male', 'Small', 'Short', 'Yes', 'Los Angeles, CA', 'Los Angeles, CA', 10, 'Permanent', '/budgerigar-bird.png')
) AS sample_data
WHERE NOT EXISTS (SELECT 1 FROM pets LIMIT 1);

-- Create a function to get all unique breeds for a species
CREATE OR REPLACE FUNCTION get_breeds_by_species(species_param VARCHAR)
RETURNS TABLE (breed VARCHAR) AS $$
BEGIN
  IF species_param = 'Any' THEN
    RETURN QUERY SELECT DISTINCT p.breed FROM pets p ORDER BY p.breed;
  ELSE
    RETURN QUERY SELECT DISTINCT p.breed FROM pets p WHERE p.species = species_param ORDER BY p.breed;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get all unique cities
CREATE OR REPLACE FUNCTION get_all_cities()
RETURNS TABLE (city VARCHAR) AS $$
BEGIN
  RETURN QUERY SELECT DISTINCT p.city FROM pets p ORDER BY p.city;
END;
$$ LANGUAGE plpgsql;
