const { default: axios } = require('axios');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4000;

// Middleware to parse incoming JSON data
app.use(express.json());

// Set the path to your HTML template file
const templatePath = path.join(__dirname, 'index.html');

// Function to generate the dynamic HTML content
function generateHTML(videoUrl1, videoUrl2) {
    return new Promise((resolve, reject) => {
      fs.readFile(templatePath, 'utf-8', (err, template) => {
        if (err) {
          reject(err);
          return;
        }
  
        const modifiedTemplate = template
          .replace('URL_TO_VIDEO_1', videoUrl1) 
          .replace('URL_TO_VIDEO_2', videoUrl2);
  
        // Save the modified HTML to a temporary file
        const generatedFilePath = path.join(__dirname, `generated.html`);
        fs.writeFile(generatedFilePath, modifiedTemplate, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(generatedFilePath);
        });
      });
    });
  }
  

// Handle POST request to serve the HTML file with embedded video URLs
app.post('/generate', async (req, res) => {
  const { videoUrl1, videoUrl2 } = req.body;

  // Call the function to generate the dynamic HTML content
  const dynamicHTMLPath = await generateHTML(videoUrl1, videoUrl2);

  // Send the HTML response to the client
  res.set('Content-Type', 'text/html');


  axios.post('https://clickindia.streamway.in:5443/LiveApp/rest/v1/webpage-recording/start?streamId=play2' , {"url": "http://localhost:8000"})
  res.sendFile(dynamicHTMLPath);
});


  // Start the server
  app.listen(port, () => {
    console.log(`Express server is running on http://localhost:${port}`);
  });