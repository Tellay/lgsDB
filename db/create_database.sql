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
('Portuguese', 'Portuguese evolved from Latin in the Iberian Peninsula, sharing roots with Galician. Influenced by Arabic during Moorish rule and shaped by maritime exploration, it spread to Africa, Asia, and South America. Regional varieties like Brazilian and European Portuguese emerged, enriched by African and indigenous vocabularies. With deep poetic and musical traditions, Portuguese embodies a blend of European, African, and American influences that continue to define its cultural identity.', 1, 250000000),

('English', 'English developed from the fusion of Anglo-Saxon, Norse, and Norman French, evolving through centuries of migration, conquest, and cultural exchange. Its expansion across the world came with British trade, science, and empire. Borrowing heavily from Latin and Greek, English adapted to diverse cultures, becoming the primary global medium of communication, technology, and literature.', 1, 1500000000),

('Spanish', 'Spanish emerged from Vulgar Latin in the Iberian Peninsula, shaped by Celtic, Basque, and Arabic influences during centuries of cultural coexistence. The language expanded globally through colonization, blending with indigenous and African languages in the Americas. Dialects such as Castilian and Latin American Spanish reflect its varied history and evolving identity as one of the most spoken and dynamic global languages.', 1, 480000000),

('French', 'French originated from the Latin of Roman Gaul, mixed with Celtic and Frankish elements. It evolved through Old and Middle French, becoming refined under royal courts and later spreading through colonization. The language influenced diplomacy, art, and philosophy worldwide, shaping cultures from Africa to the Caribbean while preserving its distinct elegance and expressive depth.', 1, 300000000),

('Mandarin', 'Mandarin, part of the Sino-Tibetan family, developed from northern Chinese dialects shaped by centuries of imperial unification. Influenced by Mongolic, Manchu, and regional languages, it became China’s official tongue. Mandarin expanded through education and migration, serving as a key symbol of cultural unity and global influence in technology, literature, and philosophy.', 2, 920000000),

('Arabic', 'Arabic arose from Semitic roots in the Arabian Peninsula, developing diverse dialects alongside Classical Arabic. It spread rapidly with Islam, influencing languages from Persian to Swahili. The language absorbed Greek, Aramaic, and Turkish terms, preserving centuries of poetry, science, and philosophy. Today, its regional forms reflect a vast cultural mosaic from North Africa to the Middle East.', 3, 430000000),

('Japanese', 'Japanese evolved from ancient Japonic dialects, influenced by Chinese writing and vocabulary, as well as Korean linguistic contact. Over time, it formed its unique writing systems—kanji, hiragana, and katakana. Isolation and later modernization shaped modern Japanese, blending native and foreign elements into a complex yet harmonious language central to Japan’s culture and identity.', 8, 125000000),

('German', 'German developed from early West Germanic dialects, influenced by Latin, Norse, and Slavic neighbors. It evolved into distinct regional forms before standardizing around High German. German shaped European science, philosophy, and literature, while absorbing terms through centuries of trade and cultural exchange, maintaining its precision and expressive richness.', 1, 135000000),

('Russian', 'Russian, an East Slavic language, originated from Old Church Slavonic and regional dialects of Kievan Rus. It evolved through Mongol rule, Westernization, and Soviet influence. The Cyrillic script unified diverse peoples across vast territories. Russian remains central to Slavic culture, literature, and science, reflecting centuries of cultural adaptation and resilience.', 1, 258000000),

('Italian', 'Italian evolved from Latin spoken in the Italian Peninsula, shaped by Etruscan, Greek, and Germanic influences. Regional dialects flourished, later unified by the Tuscan variety of Dante and Renaissance writers. Its melodic rhythm and artistic vocabulary made it the language of music, art, and design, preserving a rich heritage of cultural refinement.', 1, 85000000),

('Korean', 'Korean’s origins connect to the Koreanic family, influenced by Chinese vocabulary and possibly ancient Altaic contacts. The creation of Hangul in the 15th century revolutionized literacy, replacing classical Chinese writing. Through historical division and modernization, Korean evolved into two standardized forms, maintaining deep cultural symbolism and a strong sense of national unity.', 9, 77000000),

('Hindi', 'Hindi evolved from Sanskrit through Prakrit and Apabhraṃśa stages, absorbing Persian, Arabic, and Turkic influences during Mughal rule. Modern Hindi, written in Devanagari, coexists with Urdu as part of Hindustani. Its literature, cinema, and diverse dialects express India’s vast cultural and linguistic heritage, linking ancient traditions with modern identity.', 1, 600000000),

('Turkish', 'Turkish originated from Central Asian Turkic languages, evolving under Persian and Arabic influence during the Seljuk and Ottoman eras. After language reforms, it adopted Latin script and modernized vocabulary. Turkish bridges Asia and Europe, reflecting centuries of migration, empire, and reform that shaped its unique structure and expressive style.', 7, 88000000),

('Dutch', 'Dutch arose from Old Low Franconian, merging Germanic and Romance elements through centuries of trade and colonization. It influenced Afrikaans and Caribbean creoles, while borrowing from French and English. Its pragmatic structure and maritime history reflect a culture of commerce, innovation, and global interaction.', 1, 24000000),

('Swedish', 'Swedish developed from Old Norse, influenced by Low German through trade and by French during modernization. It evolved into a standardized national language blending Scandinavian roots with continental vocabulary. Swedish culture and literature reflect its balance between tradition, innovation, and social equality.', 1, 10000000);

INSERT INTO user (full_name, email, password) VALUES 
('John Smith', 'john.smith@example.com', '$2b$10$w7j572ZEilefc2KGc/mbB.YTWOTjOS3wnuoAPpHLWPzJ268MgH136'),
('Mary Johnson', 'mary.johnson@example.com', '$2b$10$w7j572ZEilefc2KGc/mbB.YTWOTjOS3wnuoAPpHLWPzJ268MgH136'),
('Peter Brown', 'peter.brown@example.com', '$2b$10$w7j572ZEilefc2KGc/mbB.YTWOTjOS3wnuoAPpHLWPzJ268MgH136'),
('Anna White', 'anna.white@example.com', '$2b$10$w7j572ZEilefc2KGc/mbB.YTWOTjOS3wnuoAPpHLWPzJ268MgH136'),
('Charles Green', 'charles.green@example.com', '$2b$10$w7j572ZEilefc2KGc/mbB.YTWOTjOS3wnuoAPpHLWPzJ268MgH136'),
('Laura Adams', 'laura.adams@example.com', '$2b$10$w7j572ZEilefc2KGc/mbB.YTWOTjOS3wnuoAPpHLWPzJ268MgH136'),
('Michael Davis', 'michael.davis@example.com', '$2b$10$w7j572ZEilefc2KGc/mbB.YTWOTjOS3wnuoAPpHLWPzJ268MgH136'),
('Emily Clark', 'emily.clark@example.com', '$2b$10$w7j572ZEilefc2KGc/mbB.YTWOTjOS3wnuoAPpHLWPzJ268MgH136');

INSERT INTO user_language (user_id, language_id, fluency_id) VALUES
(1, 2, 1),
(1, 3, 3),
(1, 5, 4),
(2, 1, 2),
(2, 2, 3),
(2, 4, 3),
(2, 6, 2),
(3, 3, 1),
(3, 2, 2),
(4, 7, 1),
(4, 2, 2),
(4, 5, 3),
(4, 8, 4),
(4, 1, 5),
(5, 12, 1),
(6, 1, 3),
(6, 9, 2),
(6, 4, 1),
(7, 11, 2),
(7, 2, 1),
(8, 2, 1),
(8, 10, 2),
(8, 3, 3);

INSERT INTO access_log (user_id, access_time) VALUES
(1, NOW() - INTERVAL 1 DAY),
(1, NOW() - INTERVAL 3 DAY),
(2, NOW() - INTERVAL 2 HOUR),
(3, NOW() - INTERVAL 5 DAY),
(3, NOW() - INTERVAL 1 HOUR),
(4, NOW() - INTERVAL 1 DAY),
(4, NOW() - INTERVAL 4 DAY),
(5, NOW() - INTERVAL 2 DAY),
(6, NOW() - INTERVAL 3 HOUR),
(6, NOW() - INTERVAL 7 DAY),
(7, NOW() - INTERVAL 5 HOUR),
(8, NOW() - INTERVAL 1 DAY),
(8, NOW() - INTERVAL 2 DAY);

-- Words
INSERT INTO word (name, language_id) VALUES
('Olá', 1), ('Obrigado', 1), ('Amor', 1), ('Casa', 1),
('Hello', 2), ('Thank you', 2), ('Love', 2), ('House', 2),
('Hola', 3), ('Gracias', 3), ('Amor', 3), ('Casa', 3),
('Bonjour', 4), ('Merci', 4), ('Amour', 4), ('Maison', 4),
('你好', 5), ('谢谢', 5), ('爱', 5), ('家', 5),
('مرحبا', 6), ('شكرا', 6), ('حب', 6), ('بيت', 6),
('こんにちは', 7), ('ありがとう', 7), ('愛', 7), ('家', 7),
('Hallo', 8), ('Danke', 8), ('Liebe', 8), ('Haus', 8),
('Привет', 9), ('Спасибо', 9), ('Любовь', 9), ('Дом', 9),
('Ciao', 10), ('Grazie', 10), ('Amore', 10), ('Casa', 10),
('안녕하세요', 11), ('감사합니다', 11), ('사랑', 11), ('집', 11),
('नमस्ते', 12), ('धन्यवाद', 12), ('प्यार', 12), ('घर', 12),
('Merhaba', 13), ('Teşekkürler', 13), ('Aşk', 13), ('Ev', 13),
('Hallo', 14), ('Dank je', 14), ('Liefde', 14), ('Huis', 14),
('Hej', 15), ('Tack', 15), ('Kärlek', 15), ('Hus', 15);