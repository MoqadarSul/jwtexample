const express = require("express");
const app = express();
app.use(express.json())

app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"))

app.get("/", (req, res) =>{
    res.send("Hi")
})


app.listen(8081, () =>{
    console.log("Now running on port 8081")
})