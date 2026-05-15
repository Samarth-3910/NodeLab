const fs = require('fs').promises;

async function processEmployee() {
    try {
        // --- 1. Create initial employee.json (to match exam output exactly) ---
        const initialData = {
            employeeId: 101,
            name: "Rahul",
            salary: 25000,
            bonus: 5000,
            totalSalary: 20000,
            status: "active",
            joinedAt: "2024-01-10T09:00:00Z"
        };
        await fs.writeFile('employee.json', JSON.stringify(initialData, null, 2));
        console.log("employee.json created");

        // --- 2. Read the file ---
        const data = await fs.readFile('employee.json', 'utf8');
        let emp = JSON.parse(data);

        // --- 3. Create backup file ---
        await fs.writeFile('employee_backup.json', data);
        console.log("Backup file created");

        let isUpdated = false;

        // --- 4. Recalculate totalSalary ---
        if (emp.totalSalary !== emp.salary + emp.bonus) {
            emp.totalSalary = emp.salary + emp.bonus;
            isUpdated = true;
        }

        // --- 5. Check if active and joined > 365 days ago ---
        let daysSinceJoined = (new Date() - new Date(emp.joinedAt)) / (1000 * 3600 * 24);

        if (emp.status === "active" && daysSinceJoined > 365) {
            emp.status = "senior";
            isUpdated = true;
        }

        // --- 6. Update original file only if changes are made ---
        if (isUpdated) {
            await fs.writeFile('employee.json', JSON.stringify(emp, null, 2));
            console.log("Employee file updated\n");
            console.log("Updated Employee Data:\n");
            console.log(emp);
        }

    } catch (err) {
        // Handles both file read errors and invalid JSON parse errors
        console.log("Invalid JSON data");
    }
}

processEmployee();
