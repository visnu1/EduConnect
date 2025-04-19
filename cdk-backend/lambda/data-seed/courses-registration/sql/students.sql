DROP TABLE IF EXISTS students;

CREATE TABLE students (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    dob DATE,
    phoneNumber VARCHAR(15) DEFAULT NULL,
    majorId VARCHAR(36) NOT NULL,
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