import express from 'express';
import cors from 'cors';
import { PostsController } from './controllers/PostsController'
const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log(`Server running on port ${3003}`)
})

//POSTS QUERIES
const postsController = new PostsController()

app.get('/posts', postsController.getAllPosts)
app.post('/posts', postsController.createNewPost)
app.put('/posts/:id', postsController.editPost)
app.delete('/posts/:id', postsController.deletePost)