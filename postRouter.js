const Router = require('express');
const router = new Router();
const controller = require('./postController');
const {check} = require('express-validator');

router.post('/create', [
    check('text', 'вы не можете создавать пустые посты').notEmpty(),
],
  controller.createPost
);
router.get('/getPosts', controller.getPost);
router.delete('/deletePost/:postId', controller.deletePost);
router.put('/editPost/:postId', controller.editPost);
module.exports = router;