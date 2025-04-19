DROP TABLE IF EXISTS enrollment;

CREATE TABLE enrollment (
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
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `enrollment` (`studentId`,`courseId`,`enrolledSemester`,`gradeReceived`) VALUES 
('14d090a1-69a2-4676-910d-d25d3afd3307','1f0c3403-5b53-45de-bf1a-3720096615e3','spring',NULL),
('14d090a1-69a2-4676-910d-d25d3afd3307','49ca8fa5-2679-4761-bcae-a3e048e3d35e','spring',NULL),
('14d090a1-69a2-4676-910d-d25d3afd3307','512a551c-6b24-494e-8ec9-1195ec8bfc2e','spring','A'),
('1532527a-fa58-4acb-9c4e-58e65e464429','20560830-1d05-4a91-9fbe-f425b7d717fb','spring',NULL),
('1532527a-fa58-4acb-9c4e-58e65e464429','2290f332-3c32-48b7-a48e-b9944d7b0c90','spring',NULL);
