const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'students.json');

app.use(express.json());
app.use(express.static(__dirname));

const readStudents = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) reject(err);
            else resolve(JSON.parse(data));
        });
    });
};

app.get('/students/search/:email', async (req, res) => {
    try {
        const email = req.params.email.toLowerCase();
        const students = await readStudents();
        const student = students.find(s => s.email.toLowerCase() === email);
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API 2 - DELETE by ID
app.delete('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const students = await readStudents();
        const initialLength = students.length;

        // Filter out the student with the matching ID
        const filteredStudents = students.filter(s => String(s.id) !== id);

        if (filteredStudents.length === initialLength) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Save the remaining list back to the file
        fs.writeFile(DATA_FILE, JSON.stringify(filteredStudents, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Error saving file' });
            res.json({ message: 'Student deleted successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to fetch all students to populate the table initially
app.get('/students', async (req, res) => {
    try {
        const students = await readStudents();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
