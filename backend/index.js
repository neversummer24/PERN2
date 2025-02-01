import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import routers from "./routes/index.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(cors("*"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true })); 

//mount routes
app.use("/api/v1",routers);
app.use("*", (req, res) => {
    res.status(404).json({
        status: "fail",
        message: "Route not found",
    });
})

app.listen(PORT, () => {
    console.log(`backend server is running on port ${PORT}`);
});


