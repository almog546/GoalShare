const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');

app.use(express.json());

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
app.use(
    session({
        name: 'sid',
        secret: 'super-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
        },
    })
);
app.use('/api/auth', require('./routes/authRoutes'));

app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
