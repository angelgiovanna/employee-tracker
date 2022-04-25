const { type } = require('express/lib/response');
const inquirer = require('inquirer')
const db = require('./db');
require('console.table');

const exit = () => {
    console.log('Bye!');
    process.exit(0);
};

const mainMenu = async () => {
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name:'menu',
            message: 'What would you like to do?',
            choices: [
                { name: "View all departments", value: viewDepartments },
                { name: "View all roles", value: viewRoles },
                { name: "View all employees", value: viewEmployees },
                { name: "Add a department", value: addDepartment },
                { name: "Add a role", value: addRole },
                { name: "Add an employee", value: addEmployee },
                { name: "Update an employee role", value: updateEmployeeRole },
                { name: "Exit", value: exit },
            ]
        }
    ])

    answer.menu();
};

function viewDepartments() {
    db.findDepartments().then(([ rows ]) => {
        console.table(rows);
        return mainMenu();
    });
}

function viewRoles() {
    db.findRoles().then(([ rows ]) => {
        console.table(rows);
        return mainMenu();
    });
}

function viewEmployees() {
    db.findEmployees().then(([ rows ]) => {
        console.table(rows);
        return mainMenu();
    });
}

function validateInput(value) {
    if(value) {
        return true;
    } else {
        console.log('\n Please enter a value');
        return false;
    }
}

const addDepartment = async() => {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What will be the name of the department?',
            validate: validateInput,
        },
    ]);

    const departmentName = answer.name;
    db.addDepartments(departmentName).then(() => {
        db.findDepartments().then(([ rows ]) => {
            console.table(rows);
            return mainMenu();
        });
    });
};

const addRole = async () => {
    const [rows] = await db.findDepartments();
    console.table(rows);
    const departmentChoices = rows.map(({ name, id}) => ({ name, value: id }));

    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the role title?",
            validate: validateInput,
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for this role?",
            validate: validateInput,
        },
        {
            type: "list",
            name: "department",
            message: "Which department does this role belong to?",
            choices: departmentChoices,
        },
    ]);

    db.addRoles(answer.name, answer.salary, answer.department).then(() => {
        db.findRoles().then(([ rows ]) => {
            console.table(rows);
            return mainMenu();
        });
    });
};

function showEmployeeChoices({ id, name }) {
    return { name, value: id };
}

const addEmployee = async () => {
    const [rows1] = await db.findRoles();
    console.table(rows1);
    const roleChoices = rows1.map(({ id, title })=> ({
        name: title,
        value: id,
    }));
    console.log(roleChoices);

    const [rows2] = await db.findEmployees();
    const employeeChoices = rows2.map(showEmployeeChoices);
    console.log(employeeChoices);

    const managerChoices = [...employeeChoices, { name: 'Null' }];
    console.log(managerChoices);
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "first_name",
             message: "What is the employee's first name?",
             validate: validateInput,
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
            validate: validateInput,
        },
        {
            type: "list",
            name: "role_id",
            message: "What is this employee's role?",
            choices: roleChoices,
        },
        {
            type: "confirm",
            name: "managerOrNot",
            message: "Does this employee have a manager?",
            default: true,
        },
        {
            type: "list",
            name: "manager_id",
            when: function(answers) {
                return answers.managerOrNot === true;
            },
            message: "Who is this employee's manager?",
            choices: managerChoices,
        },
    ]);

    delete answer.managerOrNot;
    console.log(answer);
    db.addAnEmployee(answer).then(() => {
        db.findEmployees().then(([ rows ]) =>{
            db.findEmployees().then(([ rows ]) => {
                console.table(rows);
                return mainMenu();
            });
        });
    });
};

const updateEmployeeRole = async () => {
    const [rows1] = await db.findRoles();
    console.table(rows1);
    const roleChoices = rows1.map(({ id, title }) => ({
        name: title,
        value: id,
    }));
    console.log(roleChoices);

    const [rows2] = await db.findEmployees();
    const employeeChoices = rows2.map(showEmployeeChoices);
    console.log(employeeChoices);
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: "employee",
            message: "For which employee would you like to update the role for?",
            choices: employeeChoices,
        },
        {
            type: "list",
            name: "role",
            message: "What is the new role for this employee?",
            choices: roleChoices,
        },
    ]);

    console.log(answer);
    db.updateEmployeeRole(answer.role, answer.employee).then(() => {
        db.findEmployees().then(( [ rows ]) => {
            console.table(rows);
            return mainMenu();
        });
    });
};

mainMenu();