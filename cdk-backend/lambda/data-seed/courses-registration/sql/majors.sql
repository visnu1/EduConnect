DROP TABLE IF EXISTS majors;

CREATE TABLE majors (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    totalCredits FLOAT DEFAULT 0,
    
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `majors` (`id`, `name`, `totalCredits`) VALUES 
('0d4968bc-1439-4b6a-b312-2a6c28e42c93', 'Computer Science', 33.0),
('bb74648e-161b-4505-b993-ff163add8129', 'Information Technology', 30.0);
