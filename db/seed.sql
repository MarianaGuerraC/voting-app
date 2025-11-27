use voting_app;

-- insert 1 admin
insert into admins (name, lastName, email, password)
values
('María', 'Pérez', 'admin@voting.com', 'admin123');

-- insert 10 voters
insert into voters (name, lastName, document, dob, is_candidate)
values
-- 8 votantes (is_candidate = 0)
('Juan', 'García', '40011223', '1990-05-12', 0),
('Ana', 'Martínez', '42122334', '1988-03-25', 0),
('Luis', 'Suárez', '38999111', '1995-10-02', 0),
('Valentina', 'Gómez', '45677889', '1999-07-17', 0),
('Sofía', 'Fernández', '37766554', '1985-11-30', 0),
('Bruno', 'Castro', '46655443', '2001-01-18', 0),
('Carolina', 'Rodríguez', '41234567', '1993-09-09', 0),
('Martín', 'Silva', '43322118', '1997-12-04', 0),

-- 2 candidatos (is_candidate = 1)
('Diego', 'López', '40123456', '1980-04-22', 1),
('Lucía', 'Torres', '39988777', '1984-06-14', 1);
