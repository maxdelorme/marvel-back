require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const axios = require("axios");

app.get("/", (req, res) => {
  res.json("C'est good");
});

app.get(/proxy\/.*/, async (req, res) => {
  try {
    // Get the path without proxy
    const path = req.url
      .split("/")
      .filter((item, index) => index !== 1)
      .join("/");
    const query =
      "https://lereacteur-marvel-api.herokuapp.com" +
      path +
      `?apiKey=${process.env.MARVEL_API_KEY}`;

    console.log(query);
    const { data } = await axios.get(query);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error.response ? error.response.data.message : error.message);
  }
});

app.all(/.*/, (req, res) => {
  res.status(404).json({ message: "Page not found on Marvel Server" });
});

app.listen(process.env.PORT, () => {
  console.log("Marvel backend started 🚀");
});
