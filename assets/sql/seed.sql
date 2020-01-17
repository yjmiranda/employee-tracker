USE employee_tracker_DB;

INSERT INTO department(name)
VALUES
    ("Engineering"),
    ("Legal"),
    ("Sales"),
    ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Lead Engineer", 150000, 1),
    ("Engineer", 120000, 1),
    ("Legal Team Lead", 250000, 2),
    ("Lawyer", 190000, 2),
    ("Sales Lead", 100000, 3),
    ("Salesperson", 80000, 3),
    ("Finance Lead", 160000, 4),
    ("Accountant", 125000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Rhonda", "Li", 1, null),
    ("Aiden", "Flores", 2, 1),
    ("Herbert", "Crawford", 3, null),
    ("Miles", "Morales", 4, 3),
    ("Nathan", "Wallace", 5, null),
    ("Charles", "Xavier", 6, 5),
    ("Angela", "Rey", 7, null),
    ("Daisy", "Ridley", 8, 7);