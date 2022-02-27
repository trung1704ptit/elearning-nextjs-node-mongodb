import express from 'express';

const router = express.Router()

// controllers
import {
  register,
  login,
  logout,
  currentUser,
  sendTestEmail,
} from "../controllers/auth";

// middlewares
import { requireSignIn } from '../middlewares'

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/current-user', requireSignIn, currentUser)
router.get('/send-email', sendTestEmail)

module.exports = router;
