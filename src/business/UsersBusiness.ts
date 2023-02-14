import { UsersDatabase } from "../database/UsersDatabase"
import { NotFoundError } from "../errors/NotFoundError"
import { BadRequestError } from "../errors/BadRequestError"
import { User } from "../models/User"
import { LoginUserInput, UsersDTO } from "../dtos/UsersDTO"
import { userDB } from "../types"

export class UsersBusiness {
    constructor(
        private usersDatabase: UsersDatabase,
        private usersDTO: UsersDTO
    ) { }

    public getUsers = async (q: string | undefined) => {

        const usersInDB = await this.usersDatabase.getUsers(q)
        const users = usersInDB.map((user) =>
            new User(
                user.id,
                user.name,
                user.email,
                user.password,
                user.role
            )
        )
        return ({ message: "Here's the users:", users })
    }

    public createNewUser = async (input: any) => {

        const { userToCreate } = input

        const [checkId] = await this.usersDatabase.checkUserId(userToCreate.id)
        if (checkId) {
            throw new BadRequestError("There's already an user with this 'id'. Each user's 'id' must be unique.")
        }

        const [checkEmail] = await this.usersDatabase.checkUserEmail(userToCreate.email)
        if (checkEmail) {
            throw new BadRequestError("There's already an user with this 'email'. Each email must not exceed one account.")
        }

        const userToBeCreated: userDB = {
            id: userToCreate.id,
            name: userToCreate.name,
            email: userToCreate.email,
            password: userToCreate.password,
            role: userToCreate.role,
            created_at: new Date().toISOString()
        }

        await this.usersDatabase.createNewUser(userToBeCreated)
        const createdUser = userToBeCreated

        const output = this.usersDTO.createNewUserOutput(createdUser)
        return output
    }

    public loginUser = async (input: LoginUserInput) => {
        const { email, password } = input
        const [getUser] = await this.usersDatabase.loginUser(email, password)

        if (!getUser) {
            throw new NotFoundError("There are no users with this email and password registered.")
        }

        const loggedUser = getUser
        const output = this.usersDTO.loginUserOutput(loggedUser)
        return output
    }
}
