import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { server, app } from "./lib/socket.js";
import path from 'path'

dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve()

//imports
import connectToMongoDB from "./lib/db.js";
import authRouter from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js"

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}))
//routes
app.use("/api/auth", authRouter);
app.use('/api/messages', messageRoute)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  app.get('*',(req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
  } )
}


server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
  connectToMongoDB()
});
