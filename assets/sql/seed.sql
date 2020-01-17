USE employee_tracker_DB;

INSERT INTO department(name)
VALUES
    ("Company"),
    ("Engineering"),
    ("Legal"),
    ("Sales"),
    ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES
    ("CEO", 350000, 1),
    ("Lead Engineer", 150000, 2),
    ("Engineer", 120000, 2),
    ("Legal Team Lead", 250000, 3),
    ("Lawyer", 190000, 3),
    ("Sales Lead", 100000, 4),
    ("Salesperson", 80000, 4),
    ("Finance Lead", 160000, 5),
    ("Accountant", 125000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Oprah", "Winfrey", 1, null),
    ("Rhonda", "Li", 2, 1),
    ("Aiden", "Flores", 3, 2),
    ("Herbert", "Crawford", 4, 1),
    ("Miles", "Morales", 5, 4),
    ("Nathan", "Wallace", 6, 1),
    ("Charles", "Xavier", 7, 6),
    ("Angela", "Rey", 8, 1),
    ("Daisy", "Ridley", 9, 8);