import { BaseDatabase } from "./BaseDatabase";
import { User } from "../models/User";
import { userDB } from "../types";

export class UsersDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    dbConnection = BaseDatabase.connection

    public async getUsers(q: string | undefined) {
        if (q) {
            let usersWithNamesLike: User[] = await
                this.dbConnection(UsersDatabase.TABLE_USERS)
                    .where("name", "LIKE", `%${q}%`)

            return usersWithNamesLike
        }

        else {
            let allUsers: User[] = await this.dbConnection(UsersDatabase.TABLE_USERS)

            return allUsers
        }
    }

    public async checkUserId(id: string) {
        const userInDB = await this.dbConnection(UsersDatabase.TABLE_USERS).where({ id })
        return userInDB
    }
    
    public async checkUserEmail(email: string) {
        const userInDB = await this.dbConnection(UsersDatabase.TABLE_USERS)
            .where({ email })
        return userInDB
    }

    public async createNewUser(userToCreate: userDB) {
        await this.dbConnection(UsersDatabase.TABLE_USERS).insert(userToCreate)
    }

    public async loginUser(email: string, password: string) {
        const user = await this.dbConnection(UsersDatabase.TABLE_USERS)
            .where({ email, password })
        return user
    }
}