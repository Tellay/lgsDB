SET NAMES utf8mb4;
SET CHARACTER_SET_CLIENT = utf8mb4;
SET CHARACTER_SET_CONNECTION = utf8mb4;
SET CHARACTER_SET_RESULTS = utf8mb4;

DROP DATABASE IF EXISTS lgsdb;
CREATE DATABASE lgsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lgsdb;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE access_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    access_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_user_access (user_id, access_time)
);

CREATE TABLE fluency (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE language_family (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE language (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    num_speakers BIGINT,
    language_family_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (language_family_id) REFERENCES language_family(id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE user_language (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    language_id INT NOT NULL,
    fluency_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (language_id) REFERENCES language(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (fluency_id) REFERENCES fluency(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY unique_user_language (user_id, language_id)
);

CREATE TABLE word (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    language_id INT NOT NULL,
    FOREIGN KEY (language_id) REFERENCES language(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE fact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL,
    language_id INT NOT NULL,
    FOREIGN KEY (language_id) REFERENCES language(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO fluency (name) VALUES 
    ('Native'),
    ('Fluent'),
    ('Advanced'),
    ('Intermediate'),
    ('Basic');

INSERT INTO language_family (name) VALUES 
    ('Indo-European'),
    ('Sino-Tibetan'),
    ('Afro-Asiatic'),
    ('Austronesian'),
    ('Niger-Congo'),
    ('Dravidian'),
    ('Turkic'),
    ('Japonic'),
    ('Koreanic'),
    ('Uralic');

INSERT INTO language (name, description, language_family_id, num_speakers) VALUES 
    ('Portuguese', 'Official language of Portugal, Brazil, and other Lusophone countries. Spoken by over 250 million people.', 1, 250000000),
    ('English', 'West Germanic language, one of the most spoken worldwide. Serves as an international lingua franca.', 1, 1500000000),
    ('Spanish', 'Romance language mainly spoken in Spain and Latin America. Second most spoken native language.', 1, 480000000),
    ('French', 'Romance language official in France and many francophone countries. Official in 29 countries.', 1, 300000000),
    ('Mandarin', 'Sino-Tibetan language spoken in China. The most spoken native language in the world.', 2, 920000000),
    ('Arabic', 'Semitic language spoken across the Middle East and North Africa. Liturgical language of Islam.', 3, 430000000),
    ('Japanese', 'Official language of Japan. Uses three writing systems: hiragana, katakana, and kanji.', 8, 125000000),
    ('German', 'West Germanic language spoken mainly in Germany, Austria, and Switzerland.', 1, 135000000),
    ('Russian', 'East Slavic language, official in Russia. Uses the Cyrillic alphabet.', 1, 258000000),
    ('Italian', 'Romance language mainly spoken in Italy. Known for its musicality.', 1, 85000000),
    ('Korean', 'Official language of both South and North Korea. Uses the Hangul alphabet.', 9, 77000000),
    ('Hindi', 'Official language of India. One of the most spoken languages in the world.', 1, 600000000),
    ('Turkish', 'Official language of Turkey. Belongs to the Turkic language family.', 7, 88000000),
    ('Dutch', 'West Germanic language spoken in the Netherlands and Belgium (Flemish).', 1, 24000000),
    ('Swedish', 'North Germanic language mainly spoken in Sweden.', 1, 10000000);

INSERT INTO user (full_name, email, password) VALUES 
    ('John Smith', 'john.smith@example.com', '$2b$10$w7j572ZEilefc2KGc/mbB.YTWOTjOS3wnuoAPpHLWPzJ268MgH136'),
    ('Mary Johnson', 'mary.johnson@example.com', '$2b$10$w7j572ZEilefc2KGc/mbB.YTWOTjOS3wnuoAPpHLWPzJ268MgH136'),
    ('Peter Brown', 'peter.brown@example.com', '$2b$10$w7j572ZEilefc2KGc/mbB.YTWOTjOS3wnuoAPpHLWPzJ268MgH136'),
    ('Anna White', 'anna.white@example.com', '$2b$10$w7j572ZEilefc2KGc/mbB.YTWOTjOS3wnuoAPpHLWPzJ268MgH136'),
    ('Charles Green', 'charles.green@example.com', '$2b$10$w7j572ZEilefc2KGc/mbB.YTWOTjOS3wnuoAPpHLWPzJ268MgH136');

INSERT INTO user_language (user_id, language_id, fluency_id) VALUES
    (1, 1, 3),
    (1, 2, 2),
    (1, 9, 5),
    (2, 7, 1),
    (2, 14, 2),
    (3, 3, 4),
    (4, 4, 2); 