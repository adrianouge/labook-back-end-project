import { BaseDatabase } from "./BaseDatabase";
import { User } from "../models/User";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    dbConnection = BaseDatabase.connection

    public async getAllUsers(q: string | undefined) {

        if (q) {
            let usersWithNamesLike: User[] = await
                this.dbConnection(UserDatabase.TABLE_USERS)
                    .where("names", "LIKE", `%${q}%`)

            return usersWithNamesLike
        }

        else {
            let allUsers: User[] = await this.dbConnection(UserDatabase.TABLE_USERS)

            return allUsers
        }
    }
}