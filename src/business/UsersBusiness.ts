import { UsersDatabase } from "../database/UsersDatabase"
import { NotFoundError } from "../errors/NotFoundError"
import { BadRequestError } from "../errors/BadRequestError"
import { User } from "../models/User"
import { LoginUserInput, UsersDTO } from "../dtos/UsersDTO"
import { userDB } from "../types"
import { TokenManager, TokenPayload, USER_ROLES } from "../services/TokenManager"
import { UnauthorizedError } from "../errors/UnauthorizedError"
import { HashManager } from "../services/HashManager"

export class UsersBusiness {
    constructor(
        private usersDatabase: UsersDatabase,
        private usersDTO: UsersDTO,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) { }

    public getUsers = async (q: string | undefined, token: string | undefined) => {

        if (token) {
            const checkToken = this.tokenManager.getPayload(token)

            if (checkToken) {

                if (checkToken.role === "ADMIN") {
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

                    const output = this.usersDTO.getUsersOutput(users)
                    return output
                }

                else {
                    throw new UnauthorizedError("Only admins may see users list.")
                }
            }
            else {
                throw new BadRequestError("Invalid token.")
            }
        }
        else {
            throw new BadRequestError("A token must be informed to access users list.")
        }
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

        const hashedPassword = await this.hashManager.hash(userToCreate.password)

        const userToBeCreated: userDB = {
            id: userToCreate.id,
            name: userToCreate.name,
            email: userToCreate.email,
            password: hashedPassword,
            role: userToCreate.role,
            created_at: new Date().toISOString()
        }

        await this.usersDatabase.createNewUser(userToBeCreated)
        const createdUser = userToBeCreated

        const tokenPayload: TokenPayload = {
            id: createdUser.id,
            name: createdUser.name,
            role: createdUser.role
        }

        const token = this.tokenManager.createToken(tokenPayload)

        const output = this.usersDTO.createNewUserOutput(createdUser, token)
        return output
    }

    public loginUser = async (input: LoginUserInput) => {
        const { email, password } = input

        const [userToLogin] = await this.usersDatabase.checkEmail(email)
        if (!userToLogin) {
            throw new NotFoundError("There are no users with this email and password registered.")
        }

        const comparedPassword = await this.hashManager.compare(password, userToLogin.password)
        if (!comparedPassword) {
            throw new NotFoundError("There are no users with this email and password registered.")
        }

        const loggedUser = userToLogin

        const tokenPayload: TokenPayload = {
            id: loggedUser.id,
            name: loggedUser.name,
            role: loggedUser.role
        }
        const token = this.tokenManager.createToken(tokenPayload)

        const output = this.usersDTO.loginUserOutput(loggedUser, token)
        return output
    }
}
