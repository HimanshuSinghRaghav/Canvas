const { default: axios } = require('axios');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000;

// Middleware to parse incoming JSON data
app.use(express.json());

// Route handler for the / route
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../generated.html');
  
  // Check if the generated.html file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If the file does not exist, send a 404 response
      res.status(404).send('File not found');
    } else {
      // If the file exists, read its contents and send it as the response
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.status(500).send('Error reading the file');
        } else {
          res.send(data);
        }
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});
