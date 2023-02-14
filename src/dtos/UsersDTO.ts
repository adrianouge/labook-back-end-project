import { BadRequestError } from "../errors/BadRequestError";
import { User } from "../models/User";
import { userDB } from "../types";

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
    user: {
        id: string,
        name: string,
        email: string,
        password: string,
        role: string
    }
}

export class UsersDTO {
    public createNewUserInput(
        id: unknown,
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
    public createNewUserOutput(createdUser: userDB): CreateNewUserOutput {
        const dto: CreateNewUserOutput = {
            message: "New user created successfully.",
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
    public loginUserOutput(loggedUser: userDB): LoginUserOutput {
        const dto: LoginUserOutput = {
            message: "Login successful.",
            user: {
                id: loggedUser.id,
                name: loggedUser.name,
                email: loggedUser.email,
                password: loggedUser.password,
                role: loggedUser.role
            }
        }
        return dto
    }
}