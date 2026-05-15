const fs = require('fs').promises;

async function processEmployee() {
    try {
        // 1. Read the existing employee.json file
        const data = await fs.readFile('employee.json', 'utf8');
        let emp = JSON.parse(data);

        // 2. Create the backup file
        await fs.writeFile('employee_backup.json', data);
        console.log("Backup file created");

        let isUpdated = false;

        // 3. Recalculate totalSalary
        if (emp.totalSalary !== emp.salary + emp.bonus) {
            emp.totalSalary = emp.salary + emp.bonus;
            isUpdated = true;
        }

        // 4. Check if active and joined > 365 days ago
        // Subtracting dates gives milliseconds. Divide by (1000 * 3600 * 24) to get days.
        let days = (new Date() - new Date(emp.joinedAt)) / (1000 * 3600 * 24);
        
        if (emp.status === "active" && days > 365) {
            emp.status = "senior";
            isUpdated = true;
        }

        // 5. Update original file only if changes are made
        if (isUpdated) {
            await fs.writeFile('employee.json', JSON.stringify(emp, null, 2));
            console.log("Employee file updated\n");
            console.log("Updated Employee Data:\n", emp);
        }

    } catch (err) {
        // If readFile or JSON.parse fails, it triggers this catch block
        console.log("Invalid JSON data"); 
    }
}

processEmployee();
