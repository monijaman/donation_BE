// external imports
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const bodyParser = require("body-parser");
var cors = require('cors');
const port = process.env.PORT || 5000;
// const datepicker = require('js-datepicker')

// internal imports
const loginRouter = require("./router/loginRouter");
const usersRouter = require("./router/usersRouter");
const inboxRouter = require("./router/inboxRouter");
const invoiceRouter = require("./router/invoiceRouter");
const apiRouter = require("./router/userApiRouter");
const apiUserRouter = require("./api/routers/userRoutes");
const apiGoalRouter = require("./api/routers/goalRoutes");
const apiDonationRouter = require("./api/routers/donationRoutes");

// internal imports
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");

const app = express();
const server = http.createServer(app);
dotenv.config();

// socket creation
const io = require("socket.io")(server);
global.io = io;

// set comment as app locals
app.locals.moment = moment;

// database connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connection successful!"))
  .catch((err) => console.log(err));

app.use(cors({ credentials: true }))
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Bodyparser middleware
// app.use(
//   bodyParser.urlencoded({
//     extended: false
//   })
// );

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());

// set view engine
app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser("chagneit"));
// app.use(cookieParser(process.env.COOKIE_SECRET));
// routing setup
app.use("/", loginRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);
app.use("/invoice", invoiceRouter);
// app.use('/api/goals', apiGoalRouter);
app.use('/api/donations/', apiDonationRouter);
app.use('/api/users', apiUserRouter);



// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}



server.listen(process.env.PORT, () => {
  console.log(`app listening to port ${process.env.PORT}`);
});
