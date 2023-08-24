const express=require("express");

const { connection } = require("./db");
const { userRouter } = require("./Routes/user.route");
const { blogRouter } = require("./Routes/blog.route");
const cors=require("cors");
require("dotenv").config()

const app=express();

app.use(express.json())

app.use("/users",userRouter)

app.use("/blog",blogRouter)
app.use(cors())
app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("connected to db")
        console.log("Runnig on port 8080")
    } catch (error) {
        console.log(error)
    }
   
})