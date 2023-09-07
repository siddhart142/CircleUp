import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";

// Router

import UserRoute from './Routes/userRoute.js'
import AuthRoute from './Routes/AuthRoute.js';
import PostRoute from './Routes/PostRoute.js';
import PostModel from "./Models/PostModel.js";

const app = express();

// Middleware

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(express.json());
// app.use(express.urlencoded()); // used for form

dotenv.config();

// Database Connection
console.log(process.env.MONGO_DB)
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`listening at ${process.env.PORT}`)
    )
  )
  .catch((error) => console.log(error));


//   Usage of Route

app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);