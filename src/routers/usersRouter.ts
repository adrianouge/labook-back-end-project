import express from "express"
import { UsersBusiness } from "../business/UsersBusiness"
import { UsersController } from "../controllers/UsersController"
import { UsersDatabase } from "../database/UsersDatabase"
import { UsersDTO } from "../dtos/UsersDTO"

export const usersRouter = express.Router()

const usersController = new UsersController(
    new UsersBusiness(
        new UsersDatabase(),
        new UsersDTO()
    ), new UsersDTO())

usersRouter.get('/', usersController.getUsers)
usersRouter.post('/', usersController.createNewUser)
usersRouter.post('/login', usersController.loginUser)