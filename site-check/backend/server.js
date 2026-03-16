const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

let monitors = []

app.post("/monitor",(req,res)=>{
  const {url,email} = req.body

  monitors.push({
    url,
    email,
    lastHash:null
  })

  res.json({status:"monitor added"})
})

app.get("/monitors",(req,res)=>{
  res.json(monitors)
})

app.listen(3001,()=>{
  console.log("server running on 3001")
})