const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

//Define path for Express Config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebar engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
//Setup static directory to serve
app.use(express.static(publicDirPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Mr Robot"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Mr Robot"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    msg: "We dont provide any help here!!",
    name: "Mr Robot"
  });
});

app.get("/weather", (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.send({
      error: "You must provide an address"
    });
  }

  geocode(address, (error, { latitude, longitude, location }={}) => {
    if (error) {
      return res.send({
        error
      });
    }
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({
          error
        });
      }
      res.send({
        location,
        forecast: forecastData,
        address
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Mr Robot",
    error: "Help article not found"
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Mr Robot",
    error: "Page not found"
  });
});

app.listen(3000, () => {
  console.log("Server is up in port 3000");
});
