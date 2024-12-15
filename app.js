const express = require("express");
require('dotenv').config();
const { db } = require("./src/config/db");
const config = require("./config");
const { users, candidates } = require("./src/routes");
const app = express();

app.use(express.json());
app.use("/users", users)
app.use("/candidates", candidates)
app.listen(config.server.port, () => {
    console.log(`server is running on port ${config.server.port}`)
})