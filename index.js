require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const bootcampRoutes = require('./routes/bootcamp.routes');
const errorHandler = require('./errorHandler/errorHandler');
const authRoutes = require('./routes/auth.routes');
const formattedResponse = require('./middleware/response.middleware');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');


const app = express();
const url = process.env.URL;
const port = process.env.PORT;


//connection with mongo db
main().catch(error => console.log(error));
async function main() {
  await mongoose.connect(url);
}
const con = mongoose.connection;
con.on('open', () => {
  console.log("Connection established successfully...");
})

//http req, res cycle handling
app.use(cors({
  origin: 'http://localhost:2000',
  methods: ['GET', 'POST'],
}))

app.use(         //Helmet using prevent common vulnerabilities such as clickjacking, cross-site scipting etc
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {       //Minimize the cross-site scripting
      "script-src": ["'self'", "securecoding.com"],
      "style-src": null,
    },
    
  }),
  helmet.xssFilter(),
  helmet.expectCt({       //prevents mis-issued SSL certificates
    maxAge: 96400,
    enforce: true,
    reportUri: "https://securecoding.com/report",
  }),
  helmet.frameguard({     //prevent clickjacking attacks
    action: "deny",
  })
)

app.use(rateLimit({       //request limiter
  windowMs: 10 * 60 * 1000,
  max: 100
}))

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));     //to parse the nested object
app.use(bodyParser.json());
app.use(
  mongoSanitize({             //Remove $ without dot and replace prohibited character with '_'
    allowDots: true,
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      console.log(`This request[${key}] is sanitized`);   //test to try bypass through injection
    },
  }),
);
// app.use('/hpp', hpp({ whitelist: [ 'filter' ] }), authRoutes);   //to check hpp please enable the route(line 68) and disable line 69
app.use('/hpp', authRoutes);
app.use(hpp());
app.use('/api/bootcamps', bootcampRoutes);
app.use('/api/auth', authRoutes);   //routes of signup and signin
app.use('*', (req, res, next) => next(createError.NotFound("Page Not Found")));
app.use(formattedResponse); //middleware for response to filter data
app.use(errorHandler);

//port setting
app.listen(port, () => {
  console.log(`Server start listening port ${port}...`);
})