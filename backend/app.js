var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var attendanceRouter = require('./routes/attendance');
var authRouter = require('./routes/auth');
var eventsRouter = require('./routes/events');
var notificationsRouter = require('./routes/notifications');
var registrationsRouter = require('./routes/registrations');
var reportsRouter = require('./routes/reports');
var volunteerHoursRouter = require('./routes/volunteerHours');
var contactRouter = require('./routes/contact');

var app = express();

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB
mongoose.connect(process.env.MongoDb_Connection)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// API Routes
app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/volunteer-hours', volunteerHoursRouter);
app.use('/api/contact', contactRouter);

// 404 Handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error Handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);

    res.json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Local Development
if (require.main === module) {
    const PORT = process.env.PORT || 4300;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Vercel
module.exports = app;