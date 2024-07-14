const express = require("express");
const path = require("path");
const createError = require("http-errors");
const cookieSession = require("cookie-session");
const configs = require("./config");
const FeedbackService = require("./services/FeedbackService");
const SpeakerService = require("./services/SpeakerService");
const routes = require("./routes");

const app = express();

const config = configs[app.get("env")];

const speakerService = new SpeakerService(config);
const feedbackService = new FeedbackService("./data/feedback.json");

const port = 5000;
app.locals.siteName = config.sitename;

app.use(cookieSession({ name: "session", keys: ["FDKFHAKHFKHAKFHAKFKA", "dfjffdsfhsfhshfksk"] }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));

app.use(async (req, res, next) => {
  try {
    const names = await speakerService.getNames();
    res.locals.speakerNames = names;
    return next();
  } catch (error) {
    return next(error);
  }
});

app.use(
  "/",
  routes({
    feedbackService,
    speakerService,
  })
);

app.use((req, res, next) => {
  return next(createError(404, "File not found"));
});

// app.use((error, req, res, next) => {
//   res.locals.message = error.message;
//   const status = error.status || 500;
//   res.locals.status = status;
//   res.status(status);
//   res.render("error");
// });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
