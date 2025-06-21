import express from 'express';
import dotenv from 'dotenv';
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js"
import articleRoutes from "./routes/ArticleRoutes.js"
import RefereeRoutes from "./routes/RefereeRoutes.js"
import LogRoutes from "./routes/LogRoutes.js"
import cors from 'cors';

dotenv.config();
//connection to the DB 
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/referees", RefereeRoutes);
app.use("/api/logs", LogRoutes);

app.listen(port, () => console.log(`Server is running on ${port}`));
