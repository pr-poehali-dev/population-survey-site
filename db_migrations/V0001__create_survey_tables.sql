-- Создание таблиц для системы опросов

-- Таблица опросов
CREATE TABLE surveys (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица вопросов
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    survey_id INTEGER NOT NULL REFERENCES surveys(id),
    question_number INTEGER NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('radio', 'text', 'scale', 'matrix')),
    question_text TEXT NOT NULL,
    options JSONB,
    min_value INTEGER,
    max_value INTEGER,
    matrix_rows JSONB,
    matrix_columns JSONB
);

-- Таблица ответов участников
CREATE TABLE survey_responses (
    id SERIAL PRIMARY KEY,
    survey_id INTEGER NOT NULL REFERENCES surveys(id),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_age INTEGER,
    user_gender TEXT
);

-- Таблица ответов на вопросы
CREATE TABLE question_answers (
    id SERIAL PRIMARY KEY,
    response_id INTEGER NOT NULL REFERENCES survey_responses(id),
    question_id INTEGER NOT NULL REFERENCES questions(id),
    answer_value TEXT,
    answer_json JSONB
);

-- Индексы для быстрого поиска
CREATE INDEX idx_questions_survey ON questions(survey_id);
CREATE INDEX idx_responses_survey ON survey_responses(survey_id);
CREATE INDEX idx_answers_response ON question_answers(response_id);
CREATE INDEX idx_answers_question ON question_answers(question_id);

-- Вставляем текущий опрос
INSERT INTO surveys (id, title, description, category, deadline) 
VALUES (1, 'Удовлетворенность населения занятиями физкультурой и спортом', 'Анкета для проведения опроса', 'Спорт и здоровье', '2025-11-30');

-- Вставляем вопросы
INSERT INTO questions (survey_id, question_number, question_type, question_text, options) VALUES
(1, 1, 'radio', '1. Пол', '["1. мужской", "2. женский"]'),
(1, 2, 'text', '2. Сколько лет Вам исполнилось?', NULL),
(1, 3, 'radio', '3. Занимаетесь Вы или Ваш ребенок в спортивной организации?', 
 '["1. Занимаюсь сам;", "2. Занимается ребенок;", "3. Занимаюсь и сам и занимается ребенок;", "4. Затрудняюсь ответить."]'),
(1, 4, 'radio', '4. Как часто Вы или Ваш ребенок посещаете в спортивную организацию?', 
 '["1. 1 – 2 раза в месяц;", "2. от 1 до 2 раза в неделю;", "3. более 3 раз в неделю;", "4. Иное"]'),
(1, 5, 'radio', '5. Какие виды услуг Вы или Ваш ребенок получаете в спортивной организации?', 
 '["1. Платные физкультурно-оздоровительные услуги (групповые занятия, индивидуальные посещения);", "2. Спортивная подготовка на безвозмездной основе;", "3. Спортивная подготовка на платной основе;", "4. Бесплатные/ платные физкультурно-оздоровительные услуги (групповые занятия, индивидуальные посещения);", "5. Иное"]');

INSERT INTO questions (survey_id, question_number, question_type, question_text, matrix_rows, matrix_columns) VALUES
(1, 6, 'matrix', '6. Насколько Вы удовлетворены следующими условиями для занятий в спортивной организации:',
 '["1. Возможность выбора занятий в соответствии со своими интересами", "2. Оборудование, санитарно-гигиеническое состояние мест занятий", "3. Материально-техническая оснащенность мест занятий (наличие и состояние спортивного оборудования и инвентаря)", "4. Удобное расписание предоставления услуг", "5. Профессионализм и отношение тренерского состава", "6. Доступность информации о проводимых физкультурно-спортивных мероприятиях", "7. Безопасность посещения спортивных объектов"]',
 '["Полностью удовлетворён", "Скорее удовлетворён", "Скорее не удовлетворён", "Совершенно не удовлетворён", "Затрудняюсь ответить"]');