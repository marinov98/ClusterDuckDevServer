import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import mongoose from "mongoose";
import passport from "passport";
import cors from "cors";
import config from "./utils/config/config";
import "./utils/config/passport-jwt";

/**
 *
 * EXPRESS INITIALIZATION
 *
 */

const app = express();

/**
 *
 * PORT
 *
 */

app.set("port", config.port);

/**
 *
 * DATABASE CONNECTION
 *
 */

mongoose.connect(config.db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  // we're connected!
  console.log(`Database connected to ${config.db_url}`);
});

/**
 *
 * MIDDLEWARE
 *
 */

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

/**
 *
 * ROUTES
 *
 */

/**
 *
 * LAUNCH SERVER
 *
 */

app.listen(config.port, () =>
  console.log(`📡 Server up! 📡 Listening on  http://localhost:${config.port}`)
);

export default app;
