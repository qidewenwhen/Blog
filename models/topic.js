var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test')
var Schema = mongoose.Schema

var topicSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    commentcnt: {
        type: Number,
        default: 0
    },
    created_time: {
        type: Date,
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Topic', topicSchema)