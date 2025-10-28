# DBEA

## Overview
This project is built with vue.js and tailwind CSS

## Project Structure
```DBEA/
│
├── node_modules/           # Installed npm packages (auto-created)
├── public/                 # Static public files (like index.html, favicon)
│   └── index.html          # HTML template; Vue mounts app here
│
├── src/                    # Main source code folder
│   ├── assets/             # Images, icons, fonts, etc.
│   ├── components/         # Reusable Vue components (.vue files—buttons, cards, etc.)
│   ├── pages/              # Contains the pages
│   ├── router/             # Vue Router configuration for page navigation
│       └── index.js        # Routes setup
│   ├── App.vue             # Root Vue component (Header, Footer etc)
│   ├── main.js             # App entry point (initializes Vue)
│
├── package.json            # Project metadata & dependencies
├── package-lock.json       # Exact dependency versions (auto-generated)
├── .gitignore              # Git ignore file
└── README.md               # Project overview, setup instructions, and documentation
```

## Getting Started

### 1. Ensure that Node.js is installed in your device
- Node.js v14 or later is needed to run and build this project
- Open Terminal run: node -v and npm -v
```bash
node -v
npm -v
```

### 2. Install Dependencies
- Open your terminal in the project folder and run npm install on your root folder:
```bash
#on your root folder
npm install
```
### 3. Running Application
- In terminal run: npm run serve
```bash
npm run serve
```

### 4. Open in Browser
-  `http://localhost:8080`
