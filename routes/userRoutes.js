const express = require('express');
// const multer = require('multer');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// const upload = multer({ dest: 'public/img/users' });

const router = express.Router();

router.post('/signup', authController.handlerSignup);
router.post('/login', authController.handlerLogin);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect); //Authentication

// work when user is logged in
router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.UpdateMe,
);
router.delete('/deleteMe', userController.DeleteMe);

// Protect all routes after this middleware
router.use(authController.restrictTo('admin')); //Authorization

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
