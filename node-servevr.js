const express = require('express');
const fs = require('fs');
const app = express();

// Serve the HTML file automatically
app.use(express.static(__dirname));

// 1. GET by Email
app.get('/students/search/:email', (req, res) => {
    // Read and parse the file in one line
    const data = JSON.parse(fs.readFileSync('students.json'));

    // Find the student
    const student = data.find(s => s.email === req.params.email);

    // Send back the student (or an error message)
    res.json(student || { error: "Not found" });
});

// 2. DELETE by ID
app.delete('/students/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync('students.json'));

    // Filter out the one we want to delete
    data = data.filter(s => s.id != req.params.id);

    // Save it back to the file
    fs.writeFileSync('students.json', JSON.stringify(data));
    res.send("Deleted successfully");
});

app.listen(3000, () => console.log('Running on port 3000'));
