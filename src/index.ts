import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

import { postsRouter } from './routers/postsRouter';
import { usersRouter } from './routers/usersRouter';

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.listen(Number(process.env.PORT), () => {
    console.log(`Server running on port ${Number(process.env.PORT)}`)
})

app.use('/posts', postsRouter)
app.use('/users', usersRouter)