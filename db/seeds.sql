USE business;

INSERT INTO department(id, name)
VALUES
(1, 'Engineering'),
(2, 'Design'),
(3, 'Sales'),
(4, 'Marketing');

INSERT INTO roles(id, title, salary, department_id)
VALUES
(1, 'Web Application Programmer', 110000, 1),
(2, 'Full Stack Web Developer', 120000, 1),
(3, 'Web graphic Designer', 50000, 2),
(4, 'Interactive Designer', 60000, 2),
(5, 'Sales Lead', 75000, 3),
(6, 'Marketing Web Developer', 90000, 4),
(7, 'Marketing Operations Manager', 85000, 4);

INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES
(1, 'Revy', 'Forger', 1, 1),
(2, 'Angel', 'Escobar', 2, 2),
(3, 'Tosen', 'Kuchiki', 3, 3),
(4, 'Giorno', 'Giovanna', 4, 1),
(5, 'Robin', 'Escobar', 2, 2),
(6, 'Malenia', 'Vinsmoke', 1, 3),
(7, 'Senku', 'Tempest', 2, 2);