import express from "express"
import {admin} from '../controllers/principalController.js'
import {protegerRuta} from "../middleware/protegerruta.js"


const router = express.Router()

router.get('/principal', protegerRuta, admin)

export default router