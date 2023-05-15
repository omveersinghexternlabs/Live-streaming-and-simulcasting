const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = process.env.PORT || 3000;

const liveController = require("./controllers/liveController");


MongoClient.connect('mongodb://localhost:27017/livestreaming', (err, client) => {
    if (err) throw err;

    const db = client.db('mydb');
    console.log("mongoose connected to db")
    
});

// JSON
app.use(express.json())
 

// route setup...
const router = express.Router();
app.use("/", router);


router.get("/", (req, res) => {
    res.send("/ is called");
});
router.get("/getlive", liveController.getlive);
router.post("/live", liveController.live);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


