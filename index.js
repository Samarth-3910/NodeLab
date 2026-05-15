const fs = require('fs').promises;

async function processEmployee() {
    try {
        // 1. Create initial employee.json to match the exam scenario
        const initialData = {
            "employeeId": 101,
            "name": "Rahul",
            "salary": 25000,
            "bonus": 5000,
            "totalSalary": 20000,
            "status": "active",
            "joinedAt": "2024-01-10T09:00:00Z"
        };
        await fs.writeFile('employee.json', JSON.stringify(initialData, null, 2));
        console.log("employee.json created");

        // 2. Read the file
        const data = await fs.readFile('employee.json', 'utf8');
        let employee;
        
        // 3. Handle invalid JSON
        try {
            employee = JSON.parse(data);
        } catch (err) {
            console.log("Invalid JSON data");
            return;
        }

        // 4. Create backup file
        await fs.writeFile('employee_backup.json', data);
        console.log("Backup file created");

        let isUpdated = false;

        // 5. Recalculate totalSalary
        let expectedTotal = employee.salary + employee.bonus;
        if (employee.totalSalary !== expectedTotal) {
            employee.totalSalary = expectedTotal;
            isUpdated = true;
        }

        // 6. Check senior status
        if (employee.status === "active") {
            let joinedDate = new Date(employee.joinedAt);
            let currentDate = new Date(); 
            let timeDiff = currentDate.getTime() - joinedDate.getTime();
            let daysDiff = timeDiff / (1000 * 3600 * 24);
            
            if (daysDiff > 365) {
                employee.status = "senior";
                isUpdated = true;
            }
        }

        // 7. Update original file only if changes are made
        if (isUpdated) {
            await fs.writeFile('employee.json', JSON.stringify(employee, null, 2));
            console.log("Employee file updated\n");
            console.log("Updated Employee Data:\n");
            console.log(employee);
        }

    } catch (err) {
        console.log("Error:", err.message);
    }
}

processEmployee();
