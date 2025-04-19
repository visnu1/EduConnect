SET FOREIGN_KEY_CHECKS = 0;

-- Majors Table

DROP TABLE IF EXISTS educonnect.majors;

CREATE TABLE educonnect.majors (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    totalCredits FLOAT DEFAULT 0,
    
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `educonnect`.`majors` (`id`, `name`, `totalCredits`) VALUES 
('0d4968bc-1439-4b6a-b312-2a6c28e42c93', 'Computer Science', 33.0),
('bb74648e-161b-4505-b993-ff163add8129', 'Information Technology', 30.0);

-- Professors TABLE

DROP TABLE IF EXISTS educonnect.professors;

CREATE TABLE educonnect.professors (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(100),
    officeHours VARCHAR(100),
    phoneNumber VARCHAR(20),
    
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `educonnect`.`professors` (`id`,`name`,`email`,`title`,`officeHours`,`phoneNumber`) VALUES 
('00d4a6bf-7789-4948-ba63-603f7c37fc06','Dr. Alexander Johnson','alexander.johnson@outlook.com','Professor','Tuesday and Thursday 10:00 AM - 12:00 PM','012-345-6789'),
('1dadabfc-40fd-49d7-9bd3-e771a8e3c257','Dr. SURAL, SHAMIK','shamik.sural@outlook.com','Assistant Professor','Tuesday and Thursday 2:00 PM - 4:00 PM','678-901-2345'),
('2e9bc584-22a5-4cd6-a008-74f6fbb0e8bf','Dr. Olivia Smith','olivia.smith@outlook.com','Associate Professor','Monday and Wednesday 1:00 PM - 3:00 PM','123-456-7890'),
('2eb02950-dff5-45e1-a76b-0700cda116d1','Dr. Sophia Davis','sophia.davis@outlook.com','Professor','Monday and Wednesday 3:00 PM - 5:00 PM','345-678-9012'),
('34d58b98-6976-45ae-82b7-586747c8ccba','Dr. Ava Martinez','ava.martinez@outlook.com','Assistant Professor','Monday and Wednesday 2:00 PM - 4:00 PM','567-890-1234'),
('5b22494f-b93c-40f3-9f96-57c0378e6333','Dr. LIDBETTER','lidbetter@outlook.com','Professor','Monday and Wednesday 10:00 AM - 12:00 PM','123-456-7890'),
('61c22d69-79bc-45ef-a737-0fb8ec7e078f','Dr. Ethan Miller','ethan.miller@outlook.com','Associate Professor','Tuesday and Thursday 4:00 PM - 6:00 PM','456-789-0123'),
('7d1192ae-ca3e-4df4-9465-f982c3f59786','Dr. PAPADIMITRIOU','papadimitriou@outlook.com','Professor','Tuesday and Thursday 10:00 AM - 12:00 PM','456-789-0123'),
('a7406baf-1cc1-49e8-8d59-ba95268598c2','Dr. ILANI, WAJAHAT','wajahat.gilani@outlook.com','Associate Professor','Monday and Wednesday 1:00 PM - 3:00 PM','567-890-1234'),
('bf126649-f543-416a-8d5a-7e4fb39d3c17','Dr. ORDILLE, JOANN','joann.ordille@outlook.com','Professor','Monday and Wednesday 3:00 PM - 5:00 PM','789-012-3456'),
('c5e0a0ea-ad4a-4bf7-ac39-ad195b75cf15','Dr. Benjamin Lee','teacher.eight@outlook.com','Assistant Professor','Tuesday and Thursday 3:00 PM - 5:00 PM','890-123-4567'),
('c8a4a162-2836-4543-a842-e6132a83be7e','Dr. HADDADAN','haddadan@outlook.com','Associate Professor','Monday and Wednesday 2:00 PM - 4:00 PM','345-678-9012'),
('cd113e9c-589e-415b-aba4-37f1057471ae','Dr. Emily Brown','teacher.nine@outlook.com','Professor','Monday and Wednesday 4:00 PM - 6:00 PM','901-234-5678'),
('e57851bd-29f3-4517-ba11-d3e01b301447','Dr. Michael Turner','michael.turner@outlook.com','Associate Professor','Tuesday and Thursday 2:00 PM - 4:00 PM','234-567-8901'),
('e8df1856-b484-453c-a161-bd032db16556','Dr. QU, MENG','meng.qu@outlook.com','Associate Professor','Tuesday and Thursday 1:00 PM - 3:00 PM','234-567-8901');

-- Students TABLE

DROP TABLE IF EXISTS educonnect.students;

CREATE TABLE educonnect.students (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    dob DATE,
    phoneNumber VARCHAR(15) DEFAULT NULL,
    majorId VARCHAR(36),
    creditsCompleted INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    
    CONSTRAINT fk_majors_students_major_id
    FOREIGN KEY (majorId) REFERENCES majors(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `educonnect`.`students` (`id`, `name`, `email`, `dob`, `phoneNumber`, `majorId`, `creditsCompleted`, `status`) VALUES 
('14d090a1-69a2-4676-910d-d25d3afd3307', 'Vishnu', 'vishnu840ranjan@gmail.com', '1996-01-03', '6361235353', 'bb74648e-161b-4505-b993-ff163add8129', 0, 'active'),
('1532527a-fa58-4acb-9c4e-58e65e464429', 'Alexander Smith', 'alex.smith@gmail.com', '1991-06-12', '1234567890', '0d4968bc-1439-4b6a-b312-2a6c28e42c93', 0, 'active'),
('255c2e3d-1f31-4b27-b587-e8be6792c8e8', 'Mikhail Pett', 'mikhail.petrov@gmail.com', '1992-04-03', '5678901234', 'bb74648e-161b-4505-b993-ff163add8129', 0, 'active'),
('3f8027d1-6eae-4e71-b9ce-3b648bd8c43e', 'Arjun Desai', 'arjun.desai@gmail.com', '1997-02-18', '5432109876', '0d4968bc-1439-4b6a-b312-2a6c28e42c93', 0, 'active'),
('7908f335-74e2-4a1d-9a1b-4ff7b41116ca', 'Aditi Sharma', 'aditi.sharma@gmail.com', '1998-04-22', '8765432109', 'bb74648e-161b-4505-b993-ff163add8129', 0, 'active'),
('8ebfde63-1886-48b9-b78e-c562cd0485c1', 'Neha Kapoor', 'neha.kapoor@gmail.com', '1990-07-05', '6543210987', 'bb74648e-161b-4505-b993-ff163add8129', 0, 'active'),
('c65f318a-c71e-4525-a97c-8cf5c70dfc95', 'Sanya Gupta', 'sanya.gupta@gmail.com', '1994-09-30', '4321098765', 'bb74648e-161b-4505-b993-ff163add8129', 0, 'active'),
('e55b0051-56b5-4ea4-ad72-5e81a61f2b29', 'Lavanya', 'lavanya@gmail.com', '1996-01-03', '6361235353', 'bb74648e-161b-4505-b993-ff163add8129', 0, 'active'),
('ed585572-2b1a-44da-926c-bc5cc6f3f165', 'Vikram Singh', 'vikram.singh@gmail.com', '1993-11-15', '7654321098', '0d4968bc-1439-4b6a-b312-2a6c28e42c93', 0, 'active'),
('fbb62b7b-3df5-40a0-8be4-70d50dcd5028', 'Sophia Brown', 'sophia.brown@gmail.com', '1999-01-08', '4567890123', '0d4968bc-1439-4b6a-b312-2a6c28e42c93', 0, 'active');

-- Courses TABLE

DROP TABLE IF EXISTS educonnect.courses;

CREATE TABLE educonnect.courses (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    offeredSemester VARCHAR(50) DEFAULT '*',
    professorId VARCHAR(36),
    credits FLOAT DEFAULT 0.0,
    classRoomNumber VARCHAR(10),
    maxStudents INT,
    campusLocation VARCHAR(255),
    day VARCHAR(30),
    startTime TIME,
    endTime TIME,

    CONSTRAINT fk_professors_courses_professor_id
    FOREIGN KEY (professorId)
    REFERENCES professors(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `educonnect`.`courses` (`id`,`name`,`offeredSemester`,`professorId`,`credits`,`classRoomNumber`,`maxStudents`,`campusLocation`,`day`,`startTime`,`endTime`) VALUES 
('1f0c3403-5b53-45de-bf1a-3720096615e3','INTRO SOFTWARE DEV','*','e8df1856-b484-453c-a161-bd032db16556',3.0,'536',5,'Newark','Thursday','10:00:00','12:50:00'),
('20560830-1d05-4a91-9fbe-f425b7d717fb','ADVANCED ROBOTICS','spring','34d58b98-6976-45ae-82b7-586747c8ccba',3.0,'333',8,'Newark','Friday','11:00:00','12:00:00'),
('2290f332-3c32-48b7-a48e-b9944d7b0c90','DBA SEMINAR II','spring','e57851bd-29f3-4517-ba11-d3e01b301447',3.0,'193',4,'Newark','Saturday','10:00:00','13:00:00'),
('32ab8faf-5c2c-4501-b6ad-26f711e19af8','INFORMATION SECURITY','*','c5e0a0ea-ad4a-4bf7-ac39-ad195b75cf15',3.0,'112',NULL,'Newark','Monday','10:00:00','12:50:00'),
('404a5d01-8e97-4e9f-8c3d-cae032c378a8','BUSINESS DATA MANAGEMENT','*','5b22494f-b93c-40f3-9f96-57c0378e6333',3.0,'112',5,'Newark','Monday','18:00:00','21:00:00'),
('49ca8fa5-2679-4761-bcae-a3e048e3d35e','DATA MINING','Fall','2e9bc584-22a5-4cd6-a008-74f6fbb0e8bf',3.0,'351',3,'Newark',NULL,NULL,NULL),
('512a551c-6b24-494e-8ec9-1195ec8bfc2e','ANALYTICS FOR BUSINESS INTELLIGENCE','*','cd113e9c-589e-415b-aba4-37f1057471ae',NULL,NULL,NULL,'New Brunswick','Sunday','12:30:00','13:45:00'),
('57d9244d-b401-483a-82a3-515041b195f0','MITA INTERNSHIP','spring','1dadabfc-40fd-49d7-9bd3-e771a8e3c257',0.0,'107',6,NULL,'Friday','13:00:00','16:00:00'),
('585ea85a-7ebd-4ff9-a698-4cd6a20a8e24','SP TPC: ADV DATABASE SYS','Fall','bf126649-f543-416a-8d5a-7e4fb39d3c17',3.0,'432',3,'Newark',NULL,NULL,NULL),
('716a9f6f-c363-4f20-a8cc-65c4df26a2dd','BUSINESS FORECASTING','*','c8a4a162-2836-4543-a842-e6132a83be7e',3.0,'234',3,'Newark','Wednesday','18:00:00','21:00:00'),
('7b0ec3ac-4ec9-4ed9-971b-72fdc068a951','SP TPC: INTRODUCTION TO DATA STRUCTURES & ALGORITHMS','Fall','7d1192ae-ca3e-4df4-9465-f982c3f59786',3.0,'104',2,'Newark','Tuesday','13:00:00','16:00:00'),
('87cb8d3b-bb97-45fe-b8c9-2cbb4c3940e9','SPECIAL TOPICS: GAME THEORETIC METHODS FOR STRATEGIC DECISION MAKING','Fall','e57851bd-29f3-4517-ba11-d3e01b301447',3.0,'103',4,NULL,'Wednesday','10:00:00','13:00:00'),
('96eadf3f-a3b2-41de-b9db-eac5a44fe5b0','SP TPC: ALGORITHMIC MACHINE LEARNING','Fall','a7406baf-1cc1-49e8-8d59-ba95268598c2',3.0,'118',NULL,'New Brunswick','Tuesday','13:00:00','16:00:00'),
('c579d2fd-7f88-44fe-83e9-0bbdaa745106','CAREER MGMT - MITA','Fall','34d58b98-6976-45ae-82b7-586747c8ccba',0.0,'117',NULL,'Newark','Thursday','14:00:00','15:20:00'),
('c5dccbbe-eb4e-45ef-9366-b205b27d741b','DATA ANALYSIS AND VISUALIZATION','Fall','00d4a6bf-7789-4948-ba63-603f7c37fc06',3.0,'224',5,'Newark','Tuesday','14:30:00','17:20:00'),
('d7f49f7a-59cc-4dc2-8436-481d4d7a99af','MITA CAPSTONE PROJECT','Fall','61c22d69-79bc-45ef-a737-0fb8ec7e078f',3.0,'330',3,'New Brunswick','Hours by arrangement',NULL,NULL),
('e601921d-58e9-468e-8106-17882bd39b55','IT STRATEGY','spring','2eb02950-dff5-45e1-a76b-0700cda116d1',3.0,'221',4,'New Brunswick','ONLINE',NULL,NULL);

-- major and courses TABLE - Many to Many relationship

DROP TABLE IF EXISTS educonnect.major_courses;

CREATE TABLE educonnect.major_courses (
    majorId VARCHAR(36) NOT NULL,
    courseId VARCHAR(36) NOT NULL,

    CONSTRAINT fk_majors_major_courses_major_id
    FOREIGN KEY (majorId)
    REFERENCES majors(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    CONSTRAINT fk_courses_major_courses_course_id
    FOREIGN KEY (courseId)
    REFERENCES courses(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `educonnect`.`major_courses` (`majorId`,`courseId`) VALUES 
('bb74648e-161b-4505-b993-ff163add8129','1f0c3403-5b53-45de-bf1a-3720096615e3'),
('0d4968bc-1439-4b6a-b312-2a6c28e42c93','20560830-1d05-4a91-9fbe-f425b7d717fb'),
('0d4968bc-1439-4b6a-b312-2a6c28e42c93','2290f332-3c32-48b7-a48e-b9944d7b0c90'),
('bb74648e-161b-4505-b993-ff163add8129','32ab8faf-5c2c-4501-b6ad-26f711e19af8'),
('bb74648e-161b-4505-b993-ff163add8129','404a5d01-8e97-4e9f-8c3d-cae032c378a8'),
('bb74648e-161b-4505-b993-ff163add8129','49ca8fa5-2679-4761-bcae-a3e048e3d35e'),
('bb74648e-161b-4505-b993-ff163add8129','512a551c-6b24-494e-8ec9-1195ec8bfc2e'),
('bb74648e-161b-4505-b993-ff163add8129','57d9244d-b401-483a-82a3-515041b195f0'),
('bb74648e-161b-4505-b993-ff163add8129','585ea85a-7ebd-4ff9-a698-4cd6a20a8e24'),
('bb74648e-161b-4505-b993-ff163add8129','716a9f6f-c363-4f20-a8cc-65c4df26a2dd'),
('bb74648e-161b-4505-b993-ff163add8129','7b0ec3ac-4ec9-4ed9-971b-72fdc068a951'),
('bb74648e-161b-4505-b993-ff163add8129','87cb8d3b-bb97-45fe-b8c9-2cbb4c3940e9'),
('bb74648e-161b-4505-b993-ff163add8129','96eadf3f-a3b2-41de-b9db-eac5a44fe5b0'),
('bb74648e-161b-4505-b993-ff163add8129','c579d2fd-7f88-44fe-83e9-0bbdaa745106'),
('bb74648e-161b-4505-b993-ff163add8129','c5dccbbe-eb4e-45ef-9366-b205b27d741b'),
('bb74648e-161b-4505-b993-ff163add8129','d7f49f7a-59cc-4dc2-8436-481d4d7a99af'),
('bb74648e-161b-4505-b993-ff163add8129','e601921d-58e9-468e-8106-17882bd39b55');

-- Enrollment TABLE

DROP TABLE IF EXISTS educonnect.enrollment;

CREATE TABLE educonnect.enrollment (
    studentId VARCHAR(36) NOT NULL,
    courseId VARCHAR(36) NOT NULL,
    enrolledSemester ENUM('spring', 'fall'),
    gradeReceived VARCHAR(2),

    CONSTRAINT fk_students_enrollment_student_id
    FOREIGN KEY (studentId)
    REFERENCES students(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    CONSTRAINT fk_courses_enrollment_course_id
    FOREIGN KEY (courseId)
    REFERENCES courses(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `educonnect`.`enrollment` (`studentId`,`courseId`,`enrolledSemester`,`gradeReceived`) VALUES 
('14d090a1-69a2-4676-910d-d25d3afd3307','1f0c3403-5b53-45de-bf1a-3720096615e3','spring',NULL),
('14d090a1-69a2-4676-910d-d25d3afd3307','49ca8fa5-2679-4761-bcae-a3e048e3d35e','spring',NULL),
('14d090a1-69a2-4676-910d-d25d3afd3307','512a551c-6b24-494e-8ec9-1195ec8bfc2e','spring','A'),
('1532527a-fa58-4acb-9c4e-58e65e464429','20560830-1d05-4a91-9fbe-f425b7d717fb','spring',NULL),
('1532527a-fa58-4acb-9c4e-58e65e464429','2290f332-3c32-48b7-a48e-b9944d7b0c90','spring',NULL);

SET FOREIGN_KEY_CHECKS = 1;

