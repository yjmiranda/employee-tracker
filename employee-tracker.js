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
        LEFT JOIN employee e ON employee.manager_id = e.id;
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