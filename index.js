const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/database');
const router = require("./routers/router")
const userRouter = require('./routers/userRouter');
const cors = require('cors');

app.use(express.json({limit: '50mb'})); // Increase the limit for larger payloads
app.use(express.urlencoded({ extended: true }));


const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            "http://localhost:5173",
            "https://blog-frontend-six-silk.vercel.app"
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error("Not allowed by CORS")); // Block the request
        }
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true // Allow credentials if using cookies or authentication headers
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
})

app.use("/api", router);
app.use("/api/auth", userRouter);

// Connect to the database
connectDB();

app.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting the server:', err);
    } else {
        console.log(`Server is running on http://localhost:${PORT}`);
    }
})
