console.log(`
######## ##     ## ########  ##        #######  ##    ## ######## ######## 
##       ###   ### ##     ## ##       ##     ##  ##  ##  ##       ##       
##       #### #### ##     ## ##       ##     ##   ####   ##       ##       
######   ## ### ## ########  ##       ##     ##    ##    ######   ######   
##       ##     ## ##        ##       ##     ##    ##    ##       ##       
##       ##     ## ##        ##       ##     ##    ##    ##       ##       
######## ##     ## ##        ########  #######     ##    ######## ######## 
######## ########     ###     ######  ##    ## ######## ########           
   ##    ##     ##   ## ##   ##    ## ##   ##  ##       ##     ##          
   ##    ##     ##  ##   ##  ##       ##  ##   ##       ##     ##          
   ##    ########  ##     ## ##       #####    ######   ########           
   ##    ##   ##   ######### ##       ##  ##   ##       ##   ##            
   ##    ##    ##  ##     ## ##    ## ##   ##  ##       ##    ##           
   ##    ##     ## ##     ##  ######  ##    ## ######## ##     ##          
`);

const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_tracker_DB"
});

connection.connect(function(err){
    if(err) throw err;

    console.log("connected as id " + connection.threadId + "\n");
    startEmployeeTracker();
});

function startEmployeeTracker() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "choice",
                message: "What would you like to do?",
                choices:
                    [
                        "View All Employees",
                        "View All Departments",
                        "View All Roles",
                        "Add An Employee",
                        "Add A Department",
                        "Add A Role",
                        "Update Employee Role",
                        "Quit"
                    ]
            }
        ]).then(function(ans){
            switch (ans.choice) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add An Employee":
                    addEmployee();
                    break;
                case "Add A Department":
                    addDepartment();
                    break;
                case "Add A Role":
                    addRole();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                default:
                    connection.end();
                    break;
            }
        });
}

function viewAllEmployees(){
    connection.query(
        `
        SELECT 
            employee.id, 
            employee.first_name AS 'First Name',
            employee.last_name AS 'Last Name',
            role.title AS 'Title',
            department.name AS 'Department',
            role.salary AS 'Salary',
            CONCAT(e.first_name , ' ' , e.last_name) AS 'Manager'
        FROM employee 
        INNER JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee e ON employee.manager_id = e.id
        ORDER BY employee.id;
        `,
        function(err,res){
            if(err) throw err;
            console.log('\n');
            console.table(res);
            startEmployeeTracker();
        }
    );
}

function viewAllDepartments(){
    connection.query(
        "SELECT id, name AS 'Department' FROM department",
        function(err,res){
            if(err) throw err;
            console.log('\n');
            console.table(res);
            startEmployeeTracker();
        }
    );
}

function viewAllRoles(){
    connection.query(
        `
        SELECT 
            role.id,
            role.title AS 'Title',
            role.salary AS 'Salary',
            department.name AS 'Department'
        FROM role
        LEFT JOIN department ON role.department_id = department.id;
        `,
        function(err,res){
            if(err) throw err;
            console.log('\n');
            console.table(res);
            startEmployeeTracker();
        }
    );
}

function addEmployee(){
    let roleList = [];
    let managerList = ["N/A"];
    let managerIDList = [null,];
    let roleIDList = [];

    getRoleData(function(data){
        for(let i = 0; i < data.length; i++){
            roleList.push(data[i].title);
            roleIDList.push(data[i].id);
        }
        getEmployeeData(function(data){
            for(let i = 0; i < data.length; i++){
                if(data[i].manager_id === null || data[i].manager_id === 1){
                    let managerName = data[i].first_name + " " + data[i].last_name;
                    managerList.push(managerName);
                    managerIDList.push(data[i].id);
                }
            }
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "firstName",
                            message: "Enter the employee's first name: ",
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: "Enter the employee's last name: ",
                        },
                        {
                            type: "list",
                            name: "role",
                            message: "What is the employee's role?",
                            choices: roleList
                        },
                        {
                            type: "list",
                            name: "manager",
                            message: "Who is the employee's manager?",
                            choices: managerList
                        }
                    ]).then(function(ans){
                        let role_id;
                        let manager_id;
                        for(let i = 0; i < managerList.length; i++){
                            if(managerList[i] === ans.manager){
                                manager_id = managerIDList[i];
                            }
                        }
                        for(let i = 0; i < roleList.length; i++){
                            if(roleList[i] === ans.role){
                                role_id = roleIDList[i];
                            }
                        }
                        connection.query(
                            `
                            INSERT INTO employee(first_name,last_name,role_id, manager_id)
                            VALUES(?,?,?,?);
                            `,
                            [ans.firstName, ans.lastName, role_id, manager_id],
                            function(err,res){
                                if(err) throw err;
                                console.log("Successfully added employee!");
                                startEmployeeTracker();
                            }
                        );
                    });
        });
    });
}

function addDepartment(){
    inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "Enter department name: "
            }
        ]).then(function(ans){
            connection.query(
                "INSERT INTO department(name) VALUES (?)",
                [ans.name],
                function(err,res){
                    if(err) throw err;
                    console.log("Successfully added department!");
                    startEmployeeTracker();
                }
            );
        });
}

function addRole(){
    let departmentList = [];
    let departmentIDList = [];
    getDepartmentData(function(data){
        for(let i = 0; i < data.length; i++){
            departmentList.push(data[i].name);
            departmentIDList.push(data[i].id);
        }
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter role title: "
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter salary: "
                },
                {
                    type: "list",
                    name: "department",
                    message: "Which department does this role belong to?",
                    choices: departmentList
                }
            ]).then(function(ans){
                let department_id;
                for(let i = 0; i < departmentList.length; i++){
                    if(departmentList[i] === ans.department){
                        department_id = departmentIDList[i];
                    }
                }
                connection.query(
                    `
                    INSERT INTO role (title, salary, department_id)
                    VALUES(?,?,?);
                    `,
                    [ans.title, ans.salary, department_id],
                    function(err, res){
                        if(err) throw err;
                        console.log("Successfully added role!");
                        startEmployeeTracker();
                    }
                );
            });
    });
}

function updateEmployeeRole(){
    let employeeList = [];
    let employeeIDList = [];
    let roleList = [];
    let roleIDList = [];

    getEmployeeData(function(data){
        for(let i = 0; i < data.length; i++){
            let employeeName = data[i].first_name + " " + data[i].last_name;
            employeeList.push(employeeName);
            employeeIDList.push(data[i].id);
        }
        getRoleData(function(data){
            for(let i = 0; i < data.length; i++){
                roleList.push(data[i].title);
                roleIDList.push(data[i].id);
            }
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Which employee's role would you like to update?",
                        choices: employeeList
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Choose the employee's new role.",
                        choices: roleList
                    }
                ]).then(function(ans){
                    let role_id;
                    let employee_id;

                    for(let i = 0; i < roleList.length; i++){
                        if(roleList[i] === ans.role){
                            role_id = roleIDList[i];
                        }
                    }
                    for(let i = 0; i < employeeList.length; i++){
                        if(employeeList[i] === ans.employee){
                            employee_id = employeeIDList[i];
                        }
                    }
                    connection.query(
                        `
                        UPDATE employee SET role_id = ? WHERE id = ?;
                        `,
                        [role_id, employee_id],
                        function(err, res){
                            if(err) throw err;
                            console.log("Successfully updated role!");
                            startEmployeeTracker();
                        }
                    );
                });
        });
    });
}

function getEmployeeData(cb){
    connection.query(
        "SELECT * FROM employee",
        function(err,res){
            if (err) throw err;
            return cb(res);
        }
    );
}

function getRoleData(cb){
    connection.query(
        "SELECT * FROM role",
        function(err,res){
            if(err) throw err;
            return cb(res);
        }
    );
}

function getDepartmentData(cb){
    connection.query(
        "SELECT * FROM department",
        function(err,res){
            if(err) throw err;
            return cb(res);
        }
    );
}