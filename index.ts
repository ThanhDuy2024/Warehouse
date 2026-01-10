import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import adminRouter from "./routers/index.route";
import { connectDatabase } from "./configs/database.config";
import cors from "cors"

const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
connectDatabase();

app.use(cors({
  origin: String(process.env.PORT_FE),
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use("/api/admin", adminRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})