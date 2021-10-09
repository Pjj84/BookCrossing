'use strict'
const Book = use("App/Models/Book")
const Story = use("App/Models/Story")
const like = use("App/Models/Like")
const Comment = use("App/Models/Comment")
const Notif = use("App/Models/Notification")
const Database = use("Database")
const Rating = use("App/Models/Rating")
const Like = use('App/Models/Like')
const Helpers = use('Helpers')

class BookController {
    async create({request, response, params, auth}){
        //try{
            if( !request.input("isbn") || !request.input('name') || !/^[a-z]+\/[a-z]+$/.test(request.input('location')) || !request.input('location') || !request.input('description') || !request.input('author') ){
                return response.status(400).send()
            }
            const user = await auth.getUser()
            const exact_same_book = await Book.query().where('isbn',request.input('isbn')).first()
            if( exact_same_book ){ return response.status(403).send() } // Already exists
            const book = new Book
            book.name = request.input('name')
            book.owner_id = user.id
            book.current_location = request.input('location')
            book.description = request.input('description')
            book.author = request.input('author')
            if(request.file('cover_image', {type: 'image',size: '2mb'})){
                const cover_image = request.file('cover_image', {types: ['image'],size: '2mb'})
                let date = new Date
                date = date.toISOString()
                await cover_image.move(Helpers.tmpPath('coverImages'), { name:  date, overwrite: true})
                book.cover_image = date
            }
            book.status = "pending"
            book.isbn = request.input('isbn')
            const book_id = await book.save()
            const story = new Story
            story.book_id = book_id
            story.journeys = 0
            story.save()
            response.status(200).json({book: book, story: story})
            const friendships = await Database.select('sender_id','receiver_id').from('friendships').where('sender_id',user.id).orWhere('receiver_id',user.id)
            for(let i = 0;i < friendships.length ; i++){
                const notif = new Notif
                notif.creator_id = user.id
                if( friendships[i].sender_id == user.id ){
                    notif.receiver_id = friendships[i].receiver_id                    
                }else{
                    notif.receiver_id = friendships[i].sender_id
                }
                notif.table = 'books'
                notif.opened = false
                notif.row_id = story.id
                notif.save()
            }
        //}catch(e){
          //  return response.status(500).send()
        //}
    }
    async rate({request, response, params, auth}){
        //try{
            let rating
            if( !request.input('rating') ||  request.input('rating') < 0 || request.input('rating') > 10 ){
                return response.status(400).send()
            }
            try{
                rating = parseInt(request.input('rating'))
            }catch(e){
                return response.status(410).send() // 410 status code means the input is not integer
            }
            const book = await Book.find(params.book_id)
            const user = await auth.getUser()
            if( !book ){ return response.status(404).send() }
            let rate = await Rating.query().where('user_id',user.id).first()
            if( !rate){ 
                rate = new Rating
                rate.book_id = book.id
                rate.user_id = user.id
                rate.rate = rating
            }else{
                rate.rate = rating
            }
            if( rate.rate < 0 || rate.rate > 10){ throw new Error }
            await rate.save()
            return response.status(200).send()
        //}catch(e){
           // return response.status(500)
        //}
    }
    async show_rating({request, response, params, auth}){ // Only for a single book
        //try{
            const book = await Book.findOrFail(params.book_id)  
            if( !book ){ return response.status(404) }
            const rate = await Database.from('ratings').where('book_id',book.id)
            return response.status(200).json({rating: rate})
        //}catch(e){
          //  return response.status(500).send()
        //}
    }
    async like({request, response, params, auth}){
        //try{
            const like = new Like       
            const user = await auth.getUser()
            like.user_id = user.id
            like.book_id = params.book_id
            if( params.like_type == 1){ like.type = 'like' }
            else if( params.like_type == 0){ like.type = 'dislike' }
            like.save()
            return response.status(200).send()
        //}catch(e){
          //  return response.status(500).send()
        //}
    }
    async show_likes({request, response, params, auth}){
        //try{
        const likes = await Database.from('likes').where('book_id',params.book_id).where('type','like').count()
        const dislikes = await Database.from('likes').where('book_id',params.book_id).where('type','dislike').count()
        return response.status(200).json({likes: likes,dislikes: dislikes})
        //}catch(e){
            //return response.status(500).send()
        //}
    }
    async comment({request, response, params, auth}){
        //try{
            const comment = new Comment
            const user = await auth.getUser()
            const query = request.get()
            if( params.book_id ){
                comment.book_id = params.book_id
            }else if( params.quote_id ){
                comment.quote_id = params.quote_id
            }
            comment.user_id = user.id
            if( !request.input('text') ){
                return reespones.status(400).send()
            }
            comment.text = request.input('text')
            if( query.replying_to ){
                comment.replying_to = query.replying_to
            }
            comment.save()
            return response.status(200).send()
        //}catch(e){
          //  return response.status(500)
        //}
    }
    async show_comments({request, response, params, auth}){
        //try{
            const book = await Book.find(params.book_id)
            const comments = await Comment.query().where('book_id',book.id).fetch()
            return response.status(200).json({comments: comments})
        //}catch(e){
            //return response.status(500).send()
        //}
    }
    async single_book({request, response, params, auth}){
        try{
            const book = await Book.findOrFail(params.book_id)
            if( !book ){ return response.status(400) }
            const likes = await Like.query().where('book_id',params.book_id).fetch()
            const comments = await Comment.query().where('book_id',params.book_id).fetch()
            return response.status(200).json({book: book, like: likes, comments: comments})
        }catch(e){
            return response.status(500)
        }
    }
    async all_books({request, response, params, auth}){
        try{
            const books = await Book.all()
            return response.status(200).json({books: books})
        }catch(e){
            return response.status(500)
        }
    }
    async add_to_reading_list({request, response, params, auth}){
        //try{
            const user = await auth.getUser()
            const book = await Book.find(params.book_id)
            if( !book ){ return response.status(404).send() }
            if( !request.input('isbn') || parseInt(request.input('isbn')) != book.isbn ){ return response.status(401).send() }
            let reading_books = user.reading_books ? user.reading_books.split(',') : []
            if( !reading_books.includes(book.id.toString()) ){
                reading_books.push(book.id.toString())
            }else if( reading_books.includes(book.id.toString()) ){
                reading_books.splice(reading_books.indexOf(book.id.toString()),1)
                if( reading_books == "" ){ reading_books = null}
            }//else{ return response.status(500) } 
            user.reading_books = reading_books ? reading_books.join(',') : null 
            user.save()
            return response.status(200).json({reading_books: reading_books,type: typeof book.id})
        //}catch(e){
          //  return response.status(500).send()
        //}
    }
    async add_to_read_list({request, response, params, auth}){
        try{
            const user = await auth.getUser()
            const book = await Book.find(params.book_id)
            if( !book ){ return response.status(404).send() }
            if( !request.input('isbn') || parseInt(request.input('isbn')) != book.isbn ){ return response.status(401).send() }
            let read_books = user.read_books ? user.read_books.split(',') : []
            if( !read_books.includes(book.id.toString()) ){
                read_books.push(book.id.toString())
            }else if( read_books.includes(book.id.toString()) ){
                read_books.splice(read_books.indexOf(book.id.toString()),1)
                if( read_books == "" ){ read_books = null}
            }//else{ return response.status(500) } 
            user.read_books = read_books ? read_books.join(',') : null 
            user.save()
            return response.status(200).json({read_books: read_books,type: typeof book.id})
        }catch(e){
            return response.status(500)
        }
    }
    async mark({request, response, params, auth}){
        try{
            const user = await auth.getUser()
            const book = await Book.find(params.book_id)
            if( !book ){ return response.status(404).send() }
            if( !request.input('isbn') || parseInt(request.input('isbn')) != book.isbn ){ return response.status(401).send() }
            let marked_books = user.marked_books ? user.marked_books.split(',') : []
            if( !marked_books.includes(book.id.toString()) ){
                marked_books.push(book.id.toString())
            }else if( marked_books.includes(book.id.toString()) ){
                marked_books.splice(marked_books.indexOf(book.id.toString()),1)
                if( marked_books == "" ){ marked_books = null}
            }//else{ return response.status(500) } 
            user.marked_books = marked_books ? marked_books.join(',') : null 
            user.save()
            return response.status(200).json({marked_books: marked_books,type: typeof book.id})
        }catch(e){
            return response.status(500)
        }
    }
    async move_to_read_list({request, response, params, auth}){
        //try{
            const user = await auth.getUser()
            const book = await Book.findOrFail(params.book_id)
            if( !book ){ return response.status(404).send() }
            if( !user.reading_books || !user.reading_books.split(',').includes(book.id.toString()) ){ return response.status(401).send() }
                const reading_list = user.reading_books.split(',')
                const read_list = user.read_books ? user.read_books.split(',') : [] 
                reading_list.splice(reading_list.indexOf(book.id.toString()),1)
                read_list.push(book.id.toString())
                user.reading_books = reading_list.join(',')
                user.read_books = read_list.join(',')
                user.save()
            return response.status(200).send()
        //}catch(e){
          //  return response.status(500).send()
        //}
    }
    async my_books({request, response, params, auth}){
       //try{
            const user = await auth.getUser()
            const added_books = await Book.query().where('owner_id',user.id).fetch()
            // Fetching marked books
            const marked_books_list = user.marked_books ? user.marked_books.split(',') : []
            const marked_books = await Book.query().whereIn('id',marked_books_list).fetch()
            // Fetching reading books
            const reading_books_list = user.reading_books ? user.reading_books.split(',') : []
            const reading_books = await Book.query().whereIn('id',reading_books_list).fetch()
            // Fetching read books
            const read_books_list = user.read_books ? user.read_books.split(',') : []
            const read_books = await Book.query().whereIn('id',read_books_list).fetch()
            return response.status(200).json({
                added_books: added_books,
                marked_books: marked_books,
                reading_books: reading_books,
                read_books: read_books
            })
        //}catch(e){
          //  return response.status(500).send()
        //}
    }
    async search({request, response, params, auth}){
        //try{
            const query = request.get()
            const books = await Database.select('*').from('books')
            const suggested_books = []
            for(let book of books){
                if( book.name.includes(query.book_name) ){ suggested_books.push(book)}
            }
            return response.status(200).json({books: suggested_books})
        //}catch(e){
            return response.status(500).sned()
        //}
    }
    async cover_image({request, response, params, auth}){
        //try{
            const book = await Book.findOrFail(params.book_id)
            if( !book ){ return response.status(404) }
            return response.status(200).json({image: book.cover_image})
        //}catch(e){
            //return response
        //}
    }
}

module.exports = BookController
