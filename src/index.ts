import express from 'express';
import cors from 'cors';
import { postsRouter } from './routers/postsRouter';
import { usersRouter } from './routers/usersRouter';

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log(`Server running on port ${3003}`)
})

app.use('/posts', postsRouter)
app.use('/users', usersRouter)