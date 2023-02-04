
export class Post {

    constructor(
        public id: string,
        public creator_id: string,
        public content: string
    ) {}
    
    
    public getContent() {
        return this.content
    }

    public setContent(newContent: string) {
        this.content = newContent
    }
}