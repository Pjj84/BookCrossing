'use strict'
const User = use("App/Models/User");
const Axios = use("Axios");
const Helpers = use("Helpers");
const Frienship = use("App/Models/Friendship")
const Notification = use("App/Models/Notification")
const Database = use("Database")

class UserController {
    async Login({request, response, auth}){
            const api_token = request.header('api_token')
            await Axios.post('url',{ token: api_token }).then((res) => {
            if(res.status == 200){
                const authenticated_user = res.user;
                //let user = await User.query().where('email',authenticated_user.email).first()
                if(!user){
                    let user = new User
                    user.email = authenticated_user.email
                    user.password = authenticated_user.password
                    user.role = authenticated_user.role // The role of the user may be specified in a different way
                    user.visibilty = 'public'
                    user.save()
                    //const token = await auth.generate(user)
                    return response.status(200).json({token: token, user: user})
                }else{
                    if(user.first_name != authenticated_user.first_name && user.last_name != authenticated_user.last_name){
                        user.first_name = authenticated_user.first_name
                        user.last_name = authenticated_user.last_name
                        user.save()
                    }
                    //const token = await auth.generate(user)
                    return response.status(200).json({token: token, user: user})
                }
            }else if(res.status == 401){
                    return response.status(401)
            }else{
                return response.status(400)
            }

            }).catch((error) => {
                return response.status(500).json({ error: error })
            })
    }
    async Edit({request, response , params}){
        try{
            const user = await User.find(params.user_id)
            user.visibilty = request.input('visibilty') || user.visibilty
            user.bio = request.input('bio') || user.bio
            if(request.file('pic', {type: 'image',size: '2mb'})){
                const pic = request.file('pic', {types: ['image'],size: '2mb'})
                await pic.move(Helpers.tmpPath('profileImages'), { name: user.email.substring(0,user.email.indexOf('@')) , overwrite: true})
                user.profile = user.email.substring(0,user.email.indexOf('@'))
            }
            user.profile = request.input('profile')
            if(request.input('first_name') || request.input('last_name')){
                user.first_name = request.input('first_name') || user.first_name
                user.last_name = request.input('last_name') || user.last_name
                await Axios.post('url',{ first_name: user.first_name, last_name: user.last_name}).catch((error) => {
                    return response.status(500).json({ error: error })
                })
                return response.status(200)
            }
            return response.status(200)
        }catch(e){
            return response.status(404)
        }
    }
    async friendship_request({request, response, params, auth}){
        try{
            const user = await auth.getUser()
            const receiver = await User.query().where('id',params.receiver_id).first()
            if( !receiver ){ return response.status(404) }
            const friendship = new Frienship
            friendship.sender_id = user.id
            friendship.receiver_id = params.receiver_id
            if( receiver.visibilty == 'public'){
                friendship.status = 'accepted'
            }else{
                friendship.status = 'pending'
            }
            friendship.save()
            return response.status(200)
        }catch(e){
            return response.status(500)
        }
    }
    async accept_friendship_request({requestm, response, params, auth}){
        try{
            const friendship = await Frienship.findOrFail(params.friendship_id)
            if( !friendship ){ return response.status(404) }
            friendship.status = 'accepted'
            friendship.save()
            return response.status(200)
        }catch(e){
            return response.status(500)
        }
    }
    async reject_friendship_request({request, response, params, auth}){
        try{
            const friendship = await Frienship.findOrFail(params.friendship_id)
            if( !friendship ){ return response.satus(404) }
            friendship.delete()
            return response.status(200)
        }catch(e){
            return response.status(500)
        }
    }
    async show_notification({request, response, params, auth}){
        try{
            const user = await auth.getUser()
            const notifs = await Notification.query().where('receiver_id',user.id).where('opened',false).fetch()
            const notifs_array = []
            for(let notif of notifs){
                if( notif.table == "books" ){
                    const book = await Book.findOrFail(notif.row_id)
                    notif.opened = true
                    notif.save()
                    notif.conetent = book
                    notifs_array.push(notif)
                }else if( notif.table == "journeys" ){
                    const journey = await journey.findOrFail(notif.row_id)
                    notif.opened = true
                    notif.save()
                    notif.content = journey
                    notifs_array.push(notif)
                }else if( notif.table == "reports"){
                    const report = await Report.findOrFail(notif.row_id)
                    notif.opened = true
                    notif.save()
                    notif.content = report
                    notifs_array.push(notif)
                }else if( notif.table == 'quotes' ){
                    const quote = await Quote.findOrFail(notif.row_id)
                    notif.opened = true
                    notif.save()
                    notif.content = quote
                    notifs_array.push(notif)
                }
            }
            return response.status(200).json({notifications: notifs_array}) // Mahdi should use the table property of notif to determine the type of notification
        }catch(e){
            return response.status(500)
        }
    }
}

module.exports = UserController
