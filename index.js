const express = require("express");

const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use("/api/zoom", require("./routes/zoomRoutes.js"));

app.use("/api/test", (req, res) => {
    res.status(200).send("Test Successful")
})

app.use((req, res) => {
    res.status(404).send({ msg: "Resource not found" });
})

app.use((err, req, res, next) => {
    console.log(err);
    let status = 500;
    let msg = "Server Error";

    if (err.name === "ValidationError") {
        status = 400;
        msg = "Validation Error"
    }
    else if (err.name === "MongooseError") {
        status = 400;
        msg = "Mongoose Error"
    }

    res.status(status).send({ msg });
})


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log("Server started at: ", PORT);
})