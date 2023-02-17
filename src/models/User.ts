
export class User {

    constructor(
        public id: string,
        public name: string,
        public email: string,
        public password: string,
        public role: string,
    ) { }

    public getName() {
        return this.name
    }

    public getEmail() {
        return this.email
    }

    public setName(newName: string) {
        this.name = newName
    }
    
    public setEmail(newEmail:string) {
        this.email = newEmail
    }
    
    public setPassword(newPassword: string) {
        this.password = newPassword
    }

}