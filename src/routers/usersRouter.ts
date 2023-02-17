import express from "express"
import { UsersBusiness } from "../business/UsersBusiness"
import { UsersController } from "../controllers/UsersController"
import { UsersDatabase } from "../database/UsersDatabase"
import { UsersDTO } from "../dtos/UsersDTO"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const usersRouter = express.Router()

const usersController = new UsersController(
    new UsersBusiness(
        new UsersDatabase(),
        new UsersDTO(),
        new TokenManager(),
        new HashManager()
    ), new UsersDTO(),
    new IdGenerator())

usersRouter.get('/', usersController.getUsers)
usersRouter.post('/signup', usersController.createNewUser)
usersRouter.post('/login', usersController.loginUser)