import { Request, Response } from "express";
import { UsersBusiness } from "../business/UsersBusiness";
import { BaseError } from "../errors/BaseError";
import { UsersDTO } from "../dtos/UsersDTO";
import { IdGenerator } from "../services/IdGenerator";

export class UsersController {
    constructor(
        private usersBusiness: UsersBusiness,
        private usersDTO: UsersDTO,
        private idGenerator: IdGenerator
    ) { }

    public getUsers = async (req: Request, res: Response) => {
        try {
            const q = req.query.q as string | undefined
            const token = req.headers.authorization
            const output = await this.usersBusiness.getUsers(q, token)

            res.status(200).send(output)
        }

        catch (error) {

            console.log(error)

            if (error instanceof BaseError) { res.send(error.message) }
            else { res.send("Unexpected error has occured.") }
        }
    }

    public createNewUser = async (req: Request, res: Response) => {
        try {

            const id = this.idGenerator.generate()
            const { name, email, password, role } = req.body
            const input = this.usersDTO.createNewUserInput(id, name, email, password, role)
            const output = await this.usersBusiness.createNewUser(input)

            res.status(200).send(output)
        }
        catch (error) {

            console.log(error)

            if (error instanceof BaseError) { res.send(error.message) }
            else { res.send("Unexpected error has occured.") }

        }
    }

    public loginUser = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const input = this.usersDTO.loginUserInput(email, password)

            const output = await this.usersBusiness.loginUser(input)
            res.status(200).send(output)
        }

        catch (error) {
            console.log(error)
            if (error instanceof BaseError) { res.send(error.message) }
            else { res.send("Unexpected error has occured.") }
        }
    }
}