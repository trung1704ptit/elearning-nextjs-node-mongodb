import express from 'express';

const router = express.Router()

// controllers
import {
  register,
  login,
  logout,
  currentUser,
  sendTestEmail,
  forgotPassword,
  resetPassword
} from "../controllers/auth";

// middlewares
import { requireSignIn } from '../middlewares'

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/current-user', requireSignIn, currentUser)
router.get('/send-email', sendTestEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)


module.exports = router;
