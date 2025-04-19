DROP TABLE IF EXISTS professors;

CREATE TABLE professors (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(100),
    officeHours VARCHAR(100),
    phoneNumber VARCHAR(20),
    
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `professors` (`id`,`name`,`email`,`title`,`officeHours`,`phoneNumber`) VALUES 
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
