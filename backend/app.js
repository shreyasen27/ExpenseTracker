const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

const app = express();
const PORT = 5000;

// ✅ Middleware to parse incoming requests
app.use(express.json()); // Ensures request bodies are parsed as JSON
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// ✅ CORS Configuration
const allowedOrigins = [
  'http://localhost:3000', // Development
 process.env.BASE_URL // Production 
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));




// ✅ Set Default Content-Type for All Responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json'); // Ensures JSON responses
  next();
});

// ✅ Session Store Configuration
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
});

store.on('error', (error) => {
  console.error('Session store error:', error);
});

// ✅ Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true, 
    secure: false // Change to true if using HTTPS
  }
}));

// ✅ Logging Middleware (Logs Headers, Content-Type, and Request Body)
app.use((req, res, next) => {
  console.log(`🟢 ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("📌 Content-Type:", req.headers['content-type'] || "Not Provided");
  console.log("Incoming Data:", JSON.stringify(req.body, null, 2));
  next();
});

// ✅ Routes Setup
const routes = readdirSync('./routes');
routes.forEach((file) => {
  const route = require(`./routes/${file}`);

  if (route && typeof route === 'object' && route.router) { 
    const routeName = file.split('.')[0]; // Extracts 'transactions' from 'transactions.js'
    app.use(`/api/v1/${routeName}`, route.router);
    console.log(`✅ Loaded route: /api/v1/${routeName}`);
  } else {
    console.error(`❌ Error: ${file} does not export a valid Express router.`);
  }
});

// ✅ Start the Server
const startServer = async () => {
  try {
    await db();
    app.listen(PORT, () => {
      console.log(`🚀 Server running at: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1); // Exit process on DB failure
  }
};

startServer();
