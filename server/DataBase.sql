-- יצירת מסד נתונים
CREATE DATABASE IF NOT EXISTS InterviewsDB;

USE InterviewsDB;

-- מחיקת הטבלאות עם מפתחות זרים קודם
DROP TABLE IF EXISTS Feedback;

DROP TABLE IF EXISTS General_Feedback;

DROP TABLE IF EXISTS Answers;

DROP TABLE IF EXISTS Questions;

DROP TABLE IF EXISTS Interviews;

DROP TABLE IF EXISTS Passwords;

-- מחיקת הטבלאות הראשיות
DROP TABLE IF EXISTS Skills;

DROP TABLE IF EXISTS Users;

-- טבלת משתמשים
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- טבלת סיסמאות
CREATE TABLE Passwords (
    password_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- טבלת מיקצועות
CREATE TABLE Skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(255) NOT NULL UNIQUE
);

-- טבלת ראיונות
CREATE TABLE Interviews (
    interview_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    interview_date DATE NOT NULL,
    feedback TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (skill_id) REFERENCES Skills(skill_id)
);

-- טבלת שאלות
CREATE TABLE Questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    skill_id INT NOT NULL,
    user_id INT NOT NULL,
    interview_id INT NOT NULL,
    question_text TEXT NOT NULL,
    FOREIGN KEY (skill_id) REFERENCES Skills(skill_id),
    FOREIGN KEY (interview_id) REFERENCES Interviews(interview_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- טבלת תשובות
CREATE TABLE Answers (
    answer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    answer_text TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (question_id) REFERENCES Questions(question_id)
);

-- טבלת משוב על תשובות
-- CREATE TABLE Feedback (
--     feedback_id INT AUTO_INCREMENT PRIMARY KEY,
--     answer_id INT NOT NULL,
--     feedback_text TEXT NOT NULL,
--     feedback_rating INT,
--     -- דירוג בין 1 ל-5
--     FOREIGN KEY (answer_id) REFERENCES Answers(answer_id)
-- );

-- -- טבלת משוב כללי
-- CREATE TABLE General_Feedback (
--     general_feedback_id INT AUTO_INCREMENT PRIMARY KEY,
--     interview_id INT NOT NULL,
--     feedback_text TEXT NOT NULL,
--     rating INT,
--     -- דירוג בין 1 ל-5
--     FOREIGN KEY (interview_id) REFERENCES Interviews(interview_id)
-- );