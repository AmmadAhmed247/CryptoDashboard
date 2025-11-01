import express from "express"

import AlertsModel from "../models/Alerts.model.js"

const router=express.Router()

router.post("/",async(req , res)=>{
    try{
        const alert=await AlertsModel.create(req.body);
        res.status(201).json(alert);
    }catch(error){
        res.status(500).json({error:error.message})
    }
})

export default router;