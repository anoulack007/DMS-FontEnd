
export interface UserModel {
    id: number
    userId: string
    username: string
    password: string
    email: string
    phone: string
    image: {
        url : string
        filename: string
    }
    company: string
}