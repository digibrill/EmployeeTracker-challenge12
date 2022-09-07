const inquirer = require('inquirer');
//const menu = require('inquirer-menu');
//const fs = require('fs');
const util = require('util');
const mysql = require('mysql2');
//const mysqlPromise = require('mysql2/promise');

/*const Employee = require('./lib/employee');*/

let positions = [];

//View all roles
let jobTitle = []; 
let roleId = [];
let department = [];
let salary = [];

// view all employees/employee data in a formatted table
let employeeId = [];
let employeeFirstName = [];
let employeeLastName = [];
let employeeTitle = [];
let employeeDepartment = [];
let employeeSalary = [];
let employeeManager = [];

// add department, add to database
let departmentName = [];
let deptItemsConv = [];

// add role, add to database
let roleName = [];
let roleSalary = [];
let roleDepartment = [];
let roleItemsConv = [];

// add employee, add to database
//let employeeFirstName = [];
//let employeeLastName = [];
let employeeRole = [];
//let employeeManager = [];

// select employee and update employee role, add to database
//let employeeRole = [];

// Connect to db
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Mysqlz777@!',
    database: 'employees'
  },
  console.log(`Connected to the employees database.`)
);

const startApp =  () => {
  inquirer.prompt([
    {
        name: "choose_action", //choose_position
        type: "list",
        message: "What do you want to do?",
        choices: ["View all employees or add employee", "View all roles or add role", "View all departments or add department", "Update employee role, department, or manager"],
    }
  ]).then((chooseActionAnswers) => {
    if(chooseActionAnswers.choose_action === "View all employees or add employee"){
        actionOptions('viewEmployees');
    }else if(chooseActionAnswers.choose_action === "View all roles or add role"){
        actionOptions('viewRoles');
    }else if(chooseActionAnswers.choose_action === "View all departments or add department"){
        actionOptions('viewDepartments');
    }else if(chooseActionAnswers.choose_action === "Update employee role, department, or manager"){
        actionOptions('updateEmployee');
    }else{}
  });

const actionOptions = (actionChoice) => {
  if(actionChoice === 'viewDepartments'){
    //SQL get departments
    db.promise().query('SELECT * FROM departments').then((result) => {
      console.table(result[0]);
    }).then(() => {
      inquirer.prompt([
    {
      name: "add_department",
      message: "Here are the current departments. Do you want to add one?",
      type: "confirm",
    },
    {
      name: "department_name",
      message: "Department name?",
      type: "input",
      when: (answers) => answers.add_department === true
    }
    ]).then((deptAnswers) => {
      db.promise().query(`INSERT INTO departments (dept_name) VALUES ('${deptAnswers.department_name}')`,{})
      db.promise().query('SELECT * FROM departments',{});
    }).then(() => {
      console.log('Thank you for using the Employee Tracker');
      startApp();
    });
    });
  }else if(actionChoice === 'viewRoles'){
    /*db.promise().query('SELECT * FROM departments').then( (result) => {
      console.table(result[0]);
    }).then(() => {
      inquirer.prompt([*/
    //SQL get departments
    let deptRoleItemsConv = [];
      //deptItems = Object.values(deptIdResult[0]);
      //deptItems.forEach(deptItem => deptItemsConv.push(deptItem.dept_name));
    //db.promise().query(`INSERT INTO departments (dept_name) VALUES ('${deptAnswers.department_name}')`,{})
    //let deptItems;
    db.promise().query('SELECT dept_name FROM departments').then( deptsForRoles => {
      deptRoleItems = Object.values(deptsForRoles[0]);
      deptRoleItems.forEach(deptRoleItem => {
        deptRoleItemsConv.push(deptRoleItem.dept_name);
        //console.log(deptRoleItemsConv);
      })
    });
    db.promise().query('SELECT role FROM roles').then( listRoles => {
      console.table(listRoles[0]);
    }).then( (roleResult) => {
      inquirer.prompt([
        {
          name: "add_role",
          message: "Here are the current roles. Do you want to add one?",
          type: "confirm",
        },
        {
          name: "enter_role",
          message: "Role name?",
          type: "input",
          when: (answers) => answers.add_role === true
        },
        {
          name: "enter_salary",
          message: "Role salary?",
          type: "input",
          when: (answers) => answers.add_role === true
        },
        {
          name: "enter_role_dept",
          message: "Choose role's department.",
          type: "list",
          choices: deptRoleItemsConv,
          when: (answers) => answers.add_role === true
        }
        ]).then((roleAnswers) => {
          let id;
          db.promise().query(`SELECT id FROM departments WHERE dept_name='${roleAnswers.enter_role_dept}'`).then( result => {
            [[{id}]] = result;
        }).then( roleAnswersNext => {
            
            //db.promise().query(`INSERT INTO roles (role, salary, dept_id) VALUES ('${roleAnswersNext.enter_role}', ${roleAnswersNext.enter_salary}, ${id}`);
          console.log(roleAnswersNext);
        })
      })
    });
  }else if(actionChoice === 'viewEmployees'){
      //SQL get departments
      db.query('SELECT * FROM roles', function (err, results) {
        roleItems = Object.values(results);
        roleItems.forEach((roleItem) => {
          roleItemsConv.push(roleItem.role);
        });
      });
      //SQL get employees
      db.query('SELECT * FROM employees', function (err, results) {
        //console.clear();
        //console.table(results);
      });
      
      inquirer.prompt([
      {
        name: "add_employee",
        message: "Here are the current employees. Do you want to add one?",
        type: "confirm"
      },
      {
        name: "enter_employee_fname",
        message: "Employee first name?",
        type: "input",
        when: (answers) => answers.add_employee === true
      },
      {
        name: "enter_employee_lname",
        message: "Employee last name?",
        type: "input",
        when: (answers) => answers.add_employee === true
      },
      {
        name: "enter_employee_role",
        message: "Employee role?",
        type: "list",
        choices: roleItemsConv,
        when: (answers) => answers.add_employee === true
      },
      {
        name: "enter_employee_mgr",
        message: "Employee manager?",
        type: "input",
        when: (answers) => answers.add_employee === true
      }
      ])
      .then((employeeAnswers) => {
        //SQL get employees
        db.query(`SELECT id FROM roles WHERE role='${employeeAnswers.enter_employee_role}'`, function (err, result) {
          const [{id}] = result;
          db.query(`INSERT INTO employees (first_name, last_name, role, manager) VALUES ('${employeeAnswers.enter_employee_fname}','${employeeAnswers.enter_employee_lname}',${id},'${employeeAnswers.enter_employee_mgr}')`, function (err, results) {
          });
        });
        db.query('SELECT * FROM employees', function (err, results) {
          //console.table(results);
        });
    }).then(() => {
      console.log('Thank you for using the Employee Tracker');
      startApp();
    });
  }else if(actionChoice === 'updateEmployee'){
      //SQL get departments
      db.query('SELECT * FROM roles', function (err, results) {
        roleItems = Object.values(results);
        roleItems.forEach((roleItem) => {
        roleItemsConv.push(roleItem.role);
        });
      });
      inquirer.prompt([
        {
          name: "update_employee",
          type: "input",
          message: "Which employee do you want to update? (enter their ID)"
        },
        {
          name: "update_manager",
          type: "input",
          message: "Which manager should they have?"
        },
        {
          name: "update_role",
          type: "list",
          message: "Which role should they have?",
          choices: roleItemsConv
        }
      ]).then((employeeAnswers) => {
        //SQL get employees
        console.clear();
        db.query(`SELECT id FROM roles WHERE role='${employeeAnswers.update_role}'`, function (err, result) {
          const [{id}] = result;
          db.query(`UPDATE employees SET role=${id}, manager='${employeeAnswers.update_manager}' WHERE id=${employeeAnswers.update_employee}`, function (err, results) {
          });
        });
        db.query('SELECT * FROM employees', function (err, results) {
          console.clear();
          console.table(results);
        });
      }).then(() => {
        console.log('Thank you for using the Employee Tracker');
        startApp();
      });
  }else{
  }
}
}

startApp();
