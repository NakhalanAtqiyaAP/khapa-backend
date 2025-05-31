const express = require('express');
const router = express.Router();
const userController = require('../controllers/users'); 
const articleController = require('../controllers/articles'); 
const commentController = require('../controllers/comments'); 
const goalController = require('../controllers/goals'); 
const galleryController = require('../controllers/gallery'); 

router.post('/logout', userController.logoutUser);
router.get('/user', userController.getUser);

//article
router.get('/articles', articleController.getArticle);
router.get('/articles/:id', articleController.getArticleById);
router.post('/articles', articleController.createArticle);
router.put('/articles/:id', articleController.updateArticle);
router.delete('/articles/:id', articleController.deleteArticle);

//comment
router.get('/articles/:article_id/comments', commentController.getCommentsByArticle);
router.get('/comments/:id', commentController.getCommentById);
router.post('/comments', commentController.createComment);
router.put('/comments/:id', commentController.updateComment);
router.delete('/comments/:id', commentController.deleteComment);

//comment
router.get('/goals', goalController.getGoal);
router.get('/goals/:id', goalController.getGoalById);
router.post('/goals', goalController.createGoal);
router.put('/goals/:id', goalController.updateGoal);
router.delete('/goals/:id', goalController.deleteGoal);

// Gallery
router.get('/gallery', galleryController.getGalleries);
router.get('/gallery/:id', galleryController.getGalleryById);
router.post('/gallery', galleryController.createGallery);
router.put('/gallery/:id', galleryController.updateGallery);
router.delete('/gallery/:id', galleryController.deleteGallery);


module.exports = router; 