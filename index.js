require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Store for URLs
let urlDatabase = [];
let idCounter = 1;

// Function to validate URLs
const validateURLs = (url) => {
	// Check if the URL starts with 'http://' or 'https://'
	const regex = /^https?:\/\/(www\.)?.+/;
	return regex.test(url);
};

// POST endpoint to create shortened URL
app.post("/api/shorturl", (req, res) => {
	const originalURL = req.body.url;

	if (!validateURLs(originalURL)) {
		return res.json({ error: "invalid url" });
	}

	// Create a new short URL entry
	const short_url = idCounter++;

	urlDatabase.push({ short_url, original_url: originalURL });
	res.json({ original_url: originalURL, short_url });
});

// GET endpoint to redirect to the original URL
app.get("/api/shorturl/:short_url", (req, res) => {
	const short_url = parseInt(req.params.short_url);

	// Find the entry with the matching short URL
	const urlEntry = urlDatabase.find((entry) => entry.short_url === short_url);

	if (!urlEntry) {
		return res.json({ error: "No short URL found for the given input" });
	}

	res.redirect(urlEntry.original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
