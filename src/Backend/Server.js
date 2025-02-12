const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { parse } = require('json2csv');
const cors = require('cors'); 
const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://localhost:5173',
}));


const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.fields([{ name: 'employeeFile', maxCount: 1 }, { name: 'previousYearFile', maxCount: 1 }]), (req, res) => {
  const employeeFilePath = req.files['employeeFile'][0].path;
  const previousYearFilePath = req.files['previousYearFile'][0].path;

  let employees = [];
  let previousAssignments = {};

  fs.createReadStream(employeeFilePath)
    .pipe(csv())
    .on('data', (row) => {
      employees.push(row);
    })
    .on('end', () => {
      fs.createReadStream(previousYearFilePath)
        .pipe(csv())
        .on('data', (row) => {
          previousAssignments[row.Employee_Name] = row.Secret_Child_Name;
        })
        .on('end', () => {
         
          const secretSantaAssignments = assignSecretSanta(employees, previousAssignments);
          
          const csvData = parse(secretSantaAssignments);

          res.header('Content-Type', 'text/csv');
          res.attachment('secret_santa_assignments.csv');
          res.send(csvData);
        });
    });
});

function assignSecretSanta(employees, previousAssignments) {
  let remainingEmployees = [...employees];
  let assignments = [];

  for (let employee of employees) {
    let assignedChild = null;

    for (let i = 0; i < remainingEmployees.length; i++) {
      let potentialChild = remainingEmployees[i];

      if (employee.Employee_Name !== potentialChild.Employee_Name && 
          previousAssignments[employee.Employee_Name] !== potentialChild.Employee_Name) {
        
        assignedChild = potentialChild;
        remainingEmployees.splice(i, 1);  
        break;
      }
    }

    if (assignedChild) {
      assignments.push({
        Employee_Name: employee.Employee_Name,
        Employee_EmailID: employee.Employee_EmailID,
        Secret_Child_Name: assignedChild.Employee_Name,
        Secret_Child_EmailID: assignedChild.Employee_EmailID
      });
    }
  }

  return assignments;
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
