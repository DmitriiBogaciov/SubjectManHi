import { User } from "@auth0/auth0-react"

interface UserDataProps
{
    _token?:string,
    _permissions?:Array<string>,
    _user?:User
}

export {UserDataProps}