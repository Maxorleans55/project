# Gift Card Database Setup Guide

## Option 1: Node.js Backend (Recommended)

### Prerequisites
1. Install Node.js from https://nodejs.org/
2. Verify installation by running `node --version` and `npm --version` in terminal

### Setup Steps
1. Open terminal in the `visual studios` directory
2. Run `npm install` to install dependencies
3. Run `npm start` to start the server
4. Open http://localhost:3000 in your browser

### Features
- Full CRUD operations (Create, Read, Update, Delete)
- Persistent data storage in JSON file
- Search functionality
- RESTful API endpoints

## Option 2: Browser-Only Solution (No Installation Required)

If you don't want to install Node.js, use the browser-only version:

1. Open `gift-browser.html` directly in your browser
2. Data will be stored in browser's localStorage
3. All features work except data won't persist across different browsers

### API Endpoints (Node.js version)
- `GET /api/giftcards` - Get all gift cards
- `GET /api/giftcards/:id` - Get specific gift card
- `POST /api/giftcards` - Create new gift card
- `PUT /api/giftcards/:id` - Update gift card
- `DELETE /api/giftcards/:id` - Delete gift card
- `GET /api/giftcards/search/:term` - Search gift cards

### File Structure
```
visual studios/
├── gift.html              # Main page (requires Node.js server)
├── gift-browser.html      # Browser-only version
├── gift.js                # Frontend with API calls
├── gift-browser.js        # Browser-only JavaScript
├── server.js              # Node.js Express server
├── package.json           # Node.js dependencies
├── giftcards.json         # Data storage file
└── README.md              # This file
```

## Troubleshooting
- If npm is not recognized, install Node.js first
- If port 3000 is busy, change PORT in server.js
- For CORS issues, make sure server is running on localhost:3000