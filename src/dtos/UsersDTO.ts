import { BadRequestError } from "../errors/BadRequestError";
import { userDB } from "../types";
import { User } from "../models/User";
export interface GetUsersOutput {
    message: string,
    users: User[]
}

export interface CreateNewUserInput {
    userToCreate: {
        id: string,
        name: string,
        email: string,
        password: string,
        role: string
    }
}
export interface CreateNewUserOutput {
    message: string,
    token: string,
    createdUser: {
        id: string,
        name: string,
        email: string,
        password: string,
        role: string,
        created_at: string
    }
}

export interface LoginUserInput {
    email: string,
    password: string
}
export interface LoginUserOutput {
    message: string,
    token: string,
    user: {
        name: string,
        email: string,
        role: string
    }
}

export class UsersDTO {
    public getUsersOutput(users: User[]): GetUsersOutput {
        const dto: GetUsersOutput = {
            message: "Here are the users:",
            users
        }
        return dto
    }
    public createNewUserInput(
        id: string,
        name: unknown,
        email: unknown,
        password: unknown,
        role: unknown
    ): CreateNewUserInput {
        if (typeof id !== "string") {
            throw new BadRequestError("New user's 'id' must be of string type.")
        }
        if (typeof name !== "string") {
            throw new BadRequestError("New user's 'name' must be of string type.")
        }
        if (typeof email !== "string") {
            throw new BadRequestError("New user's 'email' must be of string type.")
        }
        if (typeof password !== "string") {
            throw new BadRequestError("New user's 'password' must be of string type.")
        }
        if (typeof role !== "string") {
            throw new BadRequestError("New user's 'role' must be of string type.")
        }

        const dto: CreateNewUserInput = { userToCreate: { id, name, email, password, role } }
        return dto
    }
    public createNewUserOutput(createdUser: userDB, token: string): CreateNewUserOutput {
        const dto: CreateNewUserOutput = {
            message: "New user created successfully.",
            token: token,
            createdUser: {
                id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email,
                password: createdUser.password,
                role: createdUser.role,
                created_at: createdUser.created_at
            }
        }
        return dto
    }

    public loginUserInput(email: unknown, password: unknown): LoginUserInput {
        if (typeof email !== "string") {
            throw new BadRequestError("'email' for login must be of string type.")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' for login must be of string type.")
        }

        const dto: LoginUserInput = { email, password }
        return dto
    }
    public loginUserOutput(loggedUser: userDB, token: string): LoginUserOutput {
        const dto: LoginUserOutput = {
            message: "Login successful.",
            token: token,
            user: {
                name: loggedUser.name,
                email: loggedUser.email,
                role: loggedUser.role
            }
        }
        return dto
    }
}