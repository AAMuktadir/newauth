import express from "express";
import 'dotenv/config' 
import { userRouter } from "./routeHandler/userHandler.js";


const app = express()


app.use(express.json())


app.use("/auth", userRouter);

app.get('/', (req, res) => {
  res.json({msg:"akash"})
})

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`)
})