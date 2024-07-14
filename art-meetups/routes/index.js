const express = require("express");

const router = express.Router();

const speakersRoute = require("./speakers.js");
const feedbackRoute = require("./feedback.js");

module.exports = (params) => {
  const { speakerService } = params;
  router.get("/images/:type/:file", async (req, res, next) => {
    try {
      const image = await speakerService.getImage(`${req.params.type}/${req.params.file}`);
      return image.pipe(res);
    } catch (error) {
      return next(error);
    }
  });
  router.get("/", async (req, res, next) => {
    try {
      const topSpeakers = await speakerService.getList();
      const artworks = await speakerService.getAllArtwork();
      res.render("layout", { template: "home", topSpeakers, artworks });
    } catch (error) {
      return next(error);
    }
  });
  router.use("/speakers", speakersRoute(params));
  router.use("/feedback", feedbackRoute(params));
  return router;
};
