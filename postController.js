const Post = require('./models/Post');

class postController{
    async createPost(req,res){
        try {
            const {username, text, date} = req.body;
            const post = new Post(
                {
                    username, 
                    text,
                    date
                    
                }
            );
            await post.save();
            return res.json({message: "Пост успешно создан"})
        }
        catch(e) {
            console.error(e);
            return res
                .status(400)
                .json({message: "Необработанная ошибка сервера"})
        }
    }
 
async getPost(_,res){
        const posts = await Post.find();
        res.json(posts);

}
async deletePost(req, res) {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: 'Пост успешно удален' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
}
async editPost(req, res) {
    const postId = req.params.postId;
    const { newText } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }
        post.text = newText;
        await post.save();

        res.status(200).json({ message: 'Пост успешно отредактирован' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
}
}
module.exports = new postController();