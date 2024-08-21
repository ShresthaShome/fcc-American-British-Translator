"use strict";

const Translator = require("../components/translator.js");

module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    const { text, locale } = req.body;
    if (!locale || text == undefined)
      return res.json({ error: "Required field(s) missing" });
    if (!text) return res.json({ error: "No text to translate" });
    if (locale !== "american-to-british" && locale !== "british-to-american")
      return res.json({ error: "Invalid value for locale field" });
    let translation = translator.translate(text, locale);
    if (text == translation)
      return res.json({ text, translation: "Everything looks good to me!" });
    //console.log({ text, translation });
    res.json({ text, translation });
  });
};
