const express = require('express');
const router = express.Router();
const Comment = require('./models/Comments.js');

router.post('/createComment', async (req, res) => {
  try {
    const { postId, username, text, date } = req.body;
    const comment = new Comment({ postId, username, text, date });
    await comment.save();

    res.json({ message: 'Комментарий успешно создан', comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

router.get('/getComments/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ postId });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});
router.delete('/deleteComment/:commentId', async (req, res) => {
    const commentId = req.params.commentId;
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Пост не найден' });
      }
  
      await Comment.findByIdAndDelete(commentId);
  
      res.status(200).json({ message: 'Комментарий успешно удален' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});
router.put('/editComment/:commentId', async (req, res) => {
    const commentId = req.params.commentId;
    const { text } = req.body;
  
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Коментарий не найден' });
      }
  
      comment.text = text;
      await comment.save();
  
      res.status(200).json({ message: 'Комментарий  успешно отредактирован' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  });
module.exports = router;