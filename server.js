const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const maxConcurrentDownloads = 5; // Maximum number of concurrent downloads

const downloadQueue = []; // Queue to store the download tasks
let numConcurrentDownloads = 0; // Counter for current concurrent downloads

// API endpoint to accept the list of file URLs
app.post("/download", async (req, res) => {
  const urls = req.body.urls;

  // Validate the input URLs
  if (!Array.isArray(urls)) {
    res
      .status(400)
      .json({ error: "Invalid input format: URLs must be passed as an array" });
    return;
  }

  // Add the URLs to the download queue
  for (const url of urls) {
    downloadQueue.push(url);
  }

  // Start processing the download queue
  while (
    downloadQueue.length > 0 &&
    numConcurrentDownloads < maxConcurrentDownloads
  ) {
    const url = downloadQueue.shift();
    numConcurrentDownloads++;

    // Download the file asynchronously
    downloadFile(url)
      .then(() => {
        numConcurrentDownloads--;
        console.log(`Downloaded file: ${url}`);
      })
      .catch((error) => {
        numConcurrentDownloads--;
        console.error(`Error downloading file: ${url} - ${error.message}`);
      });
  }

  res.status(200).json({ message: "Download started" });
});

// Function to download a file asynchronously
async function downloadFile(url) {
  try {
    const response = await axios.get(url);
    // Save the file or perform any required processing
    console.log(`Downloaded file content: ${response.data.length} bytes`);
  } catch (error) {
    throw new Error(`Failed to download file: ${error.message}`);
  }
}

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
