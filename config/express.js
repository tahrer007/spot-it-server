const path = require("path"),
  express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  cors = require("cors");

module.exports.init = () => {
  //initialize app
  const app = express();

  app.use(cors());

  //morgan used for logging HTTP requests to the console
  app.use(morgan("dev"));

  //bodyParser middleware used for resolving the req and res body objects (urlEncoded and json formats)
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  //add routers
  const locationsRouter = require("../routers/locationsRouter");
  const usersRouter = require("../routers/usersRouter");
  const keysRouter = require("../routers/keysRouter");
  const authRouter = require("../routers/authRouter");

  app.use(authRouter);
  app.use("/users", usersRouter);
  app.use("/locations", locationsRouter);
  app.use("/keys", keysRouter);
  app.get("/testServer", (req, res) => {
    res.send("ok");
  });

  //for production build
  if (process.env.NODE_ENV === "production") {
    //Serve any static files
    app.use(express.static(path.join(__dirname, "../../client/build")));

    //Handle React routing, return all requests to React app
    app.get("*", function (req, res) {
      res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
    });
  }

  return app;
};
