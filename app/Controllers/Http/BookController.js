'use strict'
const Book = use("App/Models/Book")
const Story = use("App/Models/Story")

class BookController {
    async create({request, response, params, auth}){
        try{
            if( !request.input("isbn") || !request.input('name') || !/^[a-z]+\/[a-z]+$/.test(request.input('loacation')) || !request.input('current_location') || !request.input('description') || !request.input('author') ){
                return response.status(400)
            }
            const user = await auth.getUser()
            const book = new Book
            book.name = request.input('name')
            book.owner_id = user.id
            book.current_location = request.input('location')
            book.description = request.input('description')
            book.author = request.input('author')
            if(request.file('cover_image', {type: 'image',size: '2mb'})){
                const cover_image = request.file('cover_image', {types: ['image'],size: '2mb'})
                const date = new Date
                date = date.toISOString()
                await cover_image.move(Helpers.tmpPath('coverImages'), { name:  date, overwrite: true})
                book.cover_image = date
            }
            book.status = "pending"
            book.rates = 0
            book.save()
            const story = new Story
            story.book_id = await book.id
            story.journeys = 0
            story.save()
            return response.status(200).json({book: book, story: story})
        }catch(e){
            return response.status(500)
        }
    }
    async rate({request, response, params, auth}){
        try{
            if( !request.input('rating') || typeof request.input('rating') != 'int' ||  request.input('rating') < 0 || request.input('rating') > 10 ){
                return response.status(400)
            }
            const book = Book.findOrFail(params.book_id)
            if( !book ){
                return response.status(400)
            }
            book.rating = (book.rating * book.rates + request.input('rating')) / (book.rates + 1)
            book.rates++
            book.save()
            if( book.rating < 0 || book.rating > 10){
                throw new Error
            }
        }catch(e){
            return response.status(500)
        }
        
    }
}

module.exports = BookController
