const express = require('express')
const cors =require('cors')
const mongoose=require('mongoose')

const app=express()
app.use(cors())
app.use(express.json())
const MONGO_URL="mongodb+srv://Bhanu:3699@cluster0.slme18k.mongodb.net/CRUD"
const PORT = process.env.PORT || 5000
mongoose.connect(MONGO_URL)
    .then(()=>{
        console.log("mongodb is running")
    })
    .catch((error)=>{
        console.log(`error---${error}`)
    })


const schemaData=new mongoose.Schema({
    name:String,
    email:String,
    mobile:Number},
    {
    timestamps:true
})

const userModel =mongoose.model("user",schemaData)

// read
app.get("/get",async(req,res)=>{
    try{
        const data=await userModel.find()
        res.status(200).json(data);
    }
    catch(error){
        console.error(`there is an error:--${error}`);
        res.status(500).json({message:"server error"});
    }
})

//create
app.post("/create",async(req,res)=>{
    try{
        const{name,email,mobile}=req.body
        const data =new userModel({name,email,mobile})
        await data.save()
        res.status(201).json(data)
    }
    catch(error){
        console.log("there is an error")
        res.status(500).json({message:"server error"})
    }

})

//update
app.put("/update/:id",async(req,res)=>{
    try{
        const{name,email,mobile}=req.body;
        const data=await userModel.findByIdAndUpdate(req.params.id,
            {name,email,mobile},{new:true});
        if(!data){
            return res.status(404).json({message:"employee not found"});
        }
        res.status(200).json(data);
    }
    catch(error){
        console.error("there is an error",error);
        res.status(500).json({message:"server error"})
    }
})


//delete

app.delete("/delete/:id",async(req,res)=>{
    try{
        const data=await userModel.findByIdAndDelete(req.params.id)
        if(!data){
            return res.status(404).json({message:"user not found"})
        }
        res.status(204).send()
    }
    catch(error){
        console.error('there is an error:',error)
        res.status(500).json({message:"server error"})
    }
})


app.listen(PORT,()=>console.log("server is running")) 