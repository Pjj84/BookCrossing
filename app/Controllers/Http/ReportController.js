'use strict'
const Report = use("App/Models/Report")
const User = use("App/Models/User")
const Book = use("App/Models/Book")
const Journey = use("App/Modles/Journey")

class ReportController {
    async create({request, response, params, auth}){
        try{
            const user = await auth.getuser()  
            const report = new Report 
            if( params.type == 'user' ){
                const user = await User.findOrFail(params.id)
                if( !user ){ return response.status(404) }
                report.user_id = user.id  
            }else if( params.type == 'book' ){
                const book = await Book.findOrFail(params.id)
                if( !book ){ return response.status(404) }
                report.book_id = book.id
            }else if(params.type == 'journey' ){
                const journey = await Journey.findOrFail(params.id)
                if( !journey ){ return response.status(404) }
                report.journey_id = journey.id
            }else{ return response.status(400) }    
            report.description = request.input('description')     
            report.save()
            response.status(200)
            const friendships = await Database.select('sender_id','receiver_id').from('friendships').where('sender_id',user.id).orWhere('receiver_id',user.id)
            for(i=0;i<=friends_count;i++){
                const notif = new Notif
                notif.creator_id = user.id
                if( friendships[i].sender_id == user.id ){
                    notif.receiver_id = friendships[i].receiver_id                    
                }else{
                    notif.receiver_id = friendships[i].sender_id
                }
                notif.table = 'reports'
                notif.opened = false
                notif.row_id = report.id
                notif.save()
            }
        }catch(e){
            return response.status(500)
        }
    }
    async show_all_reports({request, response, params, auth}){
        try{
            const reports = await Report.all()
            return response.status(200).json({reports: reports})
        }catch(e){
            return response.status(500)
        }
    }
    async show_book_reports({request, response, params, auth}){
        try{
            const reports = await Report.query().whereNotNull('book_id').fetch()
            return response.status(200).json({reports: reports})
        }catch(e){
            return response.status(500)
        }
    }
    async show_journeys_reports({request, response, params, auth}){
        try{
            const reports = await Report.query().whereNotNull('journey_id').fetch()
            return response.status(200).json({reports: reports})
        }catch(e){
            return response.status(500)
        }
    }
    async show_users_reports({request, response, params, auth}){
        try{
            const reports = await Report.query().whereNotNull('user_id').fetch()
            return response.status(200).json({reports: reports})
        }catch(e){
            return response.status(500)
        }
    }
    async show_single_book({request, response, params, auth}){
        try{
            const book = await Book.findOrFail(params.book_id)
            if( !book ){ return response.status(404) }
            return response.status(200).json({book: book})
        }catch(e){
            return response.status(500)
        }
    }
    async show_single_journey({request, response, params, auth}){
        try{
            const journey = await Journey.findOrFail(params.journey_id)
            if( !journey ){ return response.status(404) }
            return response.status(200).json({journey: journey})
        }catch(e){
            return response.status(500)
        }
    }
    async show_single_user({request, response, params, auth}){
        try{
            const user = await User.findOrFail(params.user_id)
            if( !user ){ return response.status(404) }
            return response.status(200).json({user: user})
        }catch(e){
            return response.status(500)
        }
    }
    async delete_report({request, response, params, auth}){
        try{
            const report = await Report.findOrFail(params.report_id)
            if( !report ){ return response.status(404) }
            report.delete()
            return response.status(200)
        }catch(e){
            return response.status(500)
        }
    }
    async delete_book({request, response, params, auth}){
        try{
            const book = await Book.findOrFail(params.book_id)
            if( !book ){ return response.status(404) }
            book.delete()
            return response.status(200)
        }catch(e){
            return response.status(500)
        }
    }
    async delete_journey({request, response, params, auth}){
        try{
            const journey = await Journey.findOrFail(params.journey_id)
            if( !journey ){ return response.status(404) }
            journey.delete()
            return response.status(200)
        }catch(e){
            return response.status(500)
        }
    }
    async delete_user({request, response, params, auth}){
        try{
            const user = await Uesr.findOrFail(params.user_id)
            if( !user ){ return response.status(404) }
            user.delete()
            return response.status(200)
        }catch(e){
            return response.status(500)
        }
    }
}

module.exports = ReportController
