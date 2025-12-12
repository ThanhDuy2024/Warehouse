import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import adminRouter from "./routers/index.route";
import { connectDatabase } from "./configs/database.config";

const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
connectDatabase();

app.use("/api/admin", adminRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})