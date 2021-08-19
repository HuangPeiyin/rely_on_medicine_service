var mongoose = require('../common/mongodb')
var book = new mongoose.Schema({
    book_name: String,
    book_author: String,
    book_press: String,
    book_place: String,
    book_ISBN: String,
    book_publicationTime: String,
    book_picture: String,
    book_presentation: String
})
// 查找所有书籍
book.statics.findAll = function (callBack){
    this.find({}, callBack)
}
// 书籍名字查找
book.statics.findByBookName = function (name, callBack){
    this.find({ book_name: name }, callBack)
}
// 书籍_id查找
book.statics.findByBookID = function (id, callBack){
    this.find({ _id: id }, callBack)
}

var bookModel = mongoose.model('book', book)
module.exports = bookModel