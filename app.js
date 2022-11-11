require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const router = require('./routes/index');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const {
    PORT
} = process.env

Sentry.init({
    dsn: "https://998d64fab9e542f8a582269263bad347@o4504071404126208.ingest.sentry.io/4504071406813184",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// All controllers should live here
app.get("/", function rootHandler(req, res) {
    res.end("Hello world!");
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});

app.use(morgan('combined'))
app.use(express.json());
app.use('/api', router); // for the route we should use and api

app.use('/', (req, res) => { res.send('Hello This is For Using The Google Authentication') })

app.listen(PORT, () => { console.log(`listen on port ${PORT}`) });

module.exports = app
