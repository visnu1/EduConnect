DROP TABLE IF EXISTS major_courses;

CREATE TABLE major_courses (
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


INSERT INTO `major_courses` (`majorId`,`courseId`) VALUES 
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
