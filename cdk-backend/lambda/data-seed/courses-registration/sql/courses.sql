DROP TABLE IF EXISTS courses;

CREATE TABLE courses (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    offeredSemester VARCHAR(50) DEFAULT '*',
    professorId VARCHAR(36) NOT NULL,
    credits FLOAT DEFAULT 0.0,
    classRoomNumber VARCHAR(10),
    maxStudents INT,
    campusLocation VARCHAR(255),
    day VARCHAR(10),
    startTime TIME,
    endTime TIME,

    CONSTRAINT fk_professors_courses_professor_id
    FOREIGN KEY (professorId)
    REFERENCES professors(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `courses` (`id`,`name`,`offeredSemester`,`professorId`,`credits`,`classRoomNumber`,`maxStudents`,`campusLocation`,`day`,`startTime`,`endTime`) VALUES 
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
