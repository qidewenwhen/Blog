var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test')
var Schema = mongoose.Schema

var commentSchema = new Schema({
    nickname: {
        type: String,
        required: true
    },
    topicID: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_time: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Comment', commentSchema)