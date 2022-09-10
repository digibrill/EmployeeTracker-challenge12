INSERT INTO departments (dept_name)
VALUES ("Maintenance"),
       ("Administration"),
       ("Engineering");
       
INSERT INTO employees (first_name, last_name, manager, role) VALUES
   ("Fred",
   "Flintstone",
  "Wilma",
  3),
   ("Wilma",
   "Flintstone",
  "BOD",
  2),
   ("Barney",
   "Rubble",
  "Fred",
  1);

INSERT INTO roles (role, salary, dept_id) VALUES
  
    ("Janitor",
  75000,
  1),
    ("CEO",
  135000,
  2),
  ("Engineer",
  95000,
  3);