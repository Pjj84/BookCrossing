'use strict'

const { route } = require('@adonisjs/framework/src/Route/Manager')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const User = use("App/Models/User")

Route.get('login', async ({response,request, auth}) => {
        const user = await User.query().where('email',request.input('email')).first() 
        const token = await auth.generate(user)
        return response.status(200).json({user: user, token: token})
}).middleware(['guest'])

Route.on('/').render('welcome')

Route.get('signup',async ({request, response}) =>{
                const user = new User
                user.email = request.input('email')
                user.first_name = request.input('first_name')
                user.last_name = request.input('last_name')
                user.role = 'admin'
                user.visibility = 'public'
                user.save()
                return response.status(200).json({user: user})
})

/*Route.get('login',async ({request, response, params, auth}) => {
        try{
                const user = await User.query().where('email',request.input('email')).first()
                const token = await auth.generate(user)
                return response.status(200).json({user: user,token: token})
        }catch(e){
                return response.status(500)
        }
})*/

Route.get('logout',async ({request, response, auth}) => {
        try{
                const token = await auth.getAuthHeader()
                await auth.revokeTokens([token])
                return response.status(200)
        }catch(e){
                return response.status(500)
        }
}).middleware(['auth'])

Route.post('/createbook','BookController.create').as('book.create')

Route.post('/rate/:book_id','BookController.rate').as('book.rate')

Route.post('/like/:book_id?/:quote_id?/:like_type','BookController.like').as('book.like')

Route.post('/comment/:book_id?/:quote_id?','BookController.comment').as('book.comment')

Route.get('/book/single/:book_id','BookController.single_book').as('book.single_book')

Route.group(() => {
        Route.get('all','BookController.all_books').as('book.all')

        Route.post('add/reading/:book_id','BookController.add_to_reading_list').as('book.add_to_reading_list')

        Route.post('add/read/:book_id','BookController.add_to_read_list').as('book.add_to_read_list')

        Route.post('add/mark/:book_id','BookController.mark').as('book.mark')

        Route.post('move/:book_id','BookController.move_to_read_list').as('book.move')

        Route.get('my','BookController.my_books').as('book.my').middleware(['auth'])

        Route.get('find',"BookController.search").as('book.find').middleware(['auth'])

        Route.get('cover/:book_id','BookController.cover_image').as('book.cover')

        Route.get('journeys/:book_id','JourneyController.books_journeys').as('book.journeys')

        Route.get('reports','ReportController.books_reports').as('book.reports')

        Route.get('rating/:book_id','BookController.show_rating').as('book.rating')

        Route.get('likes/:book_id','BookController.show_likes').as('book.likes')

        Route.get('comments/:book_id','BookController.show_comments').as('book.comments')
}).prefix('book')

Route.group(() => {
        Route.post('create/:story_id','JourneyController.create').as('journey.create')

        Route.get('reports','ReportController.journeys_reports').as('journey.reports')
})

Route.group(() => {
        Route.post('create','QuoteController.create').as('quote.create')

        Route.delete('delete','QuoteController.delete').as('quote.delete')
}).prefix('quote')

Route.group(() => {
        Route.post('report/create/:type/:id','ReportController.create').as('report.create')

        Route.get('all','ReportController.all_reports').as('report.all')

        Route.get('book','ReportController.single_book').as('report.book')

        Route.get('journey','ReportController.single_journey').as('report.journey')

        Route.get('user','ReportController.single_user').as('report.user')

        Route.delete('delete','ReportController.delete_report').as('report.dismiss')

        Route.delete('delete/book','ReportController.delete_book').as('report.delete_book')

        Route.delete('delete/journey','ReportController.delete_journey').as('report.delete_journey')

        Route.delete('delete/user','ReportController.delete_user').as('report.delete_user')
}).prefix('report')


