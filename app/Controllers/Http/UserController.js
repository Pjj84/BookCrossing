'use strict'
const User = use("App/Models/User");
const Axios = use("Axios");

class UserController {
    async Login({request, response}){
        try{
            await auth.check()
            return response.status(200)
        }catch(error){
            const cridentials = request.only(['username','password'])
            const api_token = request.header('api_token')
            if(cridentials.username && cridentials.password){
                const token = await auth.attempt(cridentials.username, cridentials.password)
                if(token){
                    return response.status(200).json({token: token})
                }else{
                    return response.status(401)
                }
            }else if(api_token){
                const res =await Axios.get('url')
                if(res.status == 200){
                    const authenticated_user = res.user
                    let user = await User.query().where('username',authenticated_user.username).where('email',authenticated_user.email).fetch()
                    if(!user){
                        user = new User
                        user.email = authenticated_user.email
                        user.password = authenticated_user.password
                        user.role = authenticated_user.role // The role of the user may be specified in a different way
                        user.save()
                        const token = await auth.generate(user)
                        return response.status(200).json({token: token})
                    }else{
                        const token = await auth.generate(bookcrossing_user)
                        return response.status(200).json({token: token})
                    }
                }else if(res.status == 401){
                    return response.status(401)
                }
            }else{
                return response.status(400) // No api token nor credentials
            }
        }
    }
}

module.exports = UserController
