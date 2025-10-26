import express from "express"

import {getLiquidations,get24hrData,getTotalVolume} from "../controllers/allLiquidation.controller.js"


const router=express.Router()

router.get("/liquidation",getLiquidations)
router.get("/liquidation/24hr",get24hrData)
router.get("/liquidation/24hrvolume",getTotalVolume)


export default router