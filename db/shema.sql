create database voting_app;
use voting_app;

create table admins (
    id int NOT NULL auto_increment PRIMARY KEY, -- omito int(11) = deprecated
    name varchar(255) NOT NULL, -- sugiero varchar mas chicos ej  100
    lastName varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL
    
);

create table voters (
    id int NOT NULL auto_increment PRIMARY KEY,
    name varchar(255) NOT NULL,
    lastName varchar(255) NOT NULL,
    document varchar(255) NOT NULL,
    dob date NOT NULL,
	is_candidate tinyint(1) NOT NULL -- boolean: 1=candidato, 0=votante
);

create table votes (
    id int NOT NULL auto_increment PRIMARY KEY,
    candidate_id int NOT NULL,
    candidate_voted_id int NOT NULL,
    date datetime,

    FOREIGN KEY (candidate_id) REFERENCES voters(id),
    FOREIGN KEY (candidate_voted_id) REFERENCES voters(id)
);
