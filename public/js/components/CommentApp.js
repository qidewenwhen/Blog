import React, { Component } from 'react'
import CommentInput from '@/components/CommentInput'
import CommnetList from '@/components/CommentList'
import '@/css/userstyle.css'

class CommentApp extends Component {
    constructor() {
        super()
        this.state = {
            comments: []
        }
    }

    static _topicID = ''
    static _nickname = ''

    componentWillMount() {
        this._loadComments()
    }

    _loadComments() {
        fetch('http://127.0.0.1:5000/component/getComment', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(reply => {
                this.setState({ comments: JSON.parse(reply.comments) })
                this._nickname = reply.nickname
                this._topicID = this.state.comments[0].topicID
            })
    }

    _saveComments(comment) {
        fetch('http://127.0.0.1:5000/topics/show', {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(reply => {
                if (reply.err_code === 0) {
                    window.location.href = '/'
                } else {
                    window.alert('Save reply error')
                }
            })
    }

    handleSubmitComment = (comment) => {
        if(!comment) {
            return
        }
        if (!comment.content) {
            return alert('please input content')
        }
        const comments = this.state.comments
        comment.topicID = this._topicID////
        comment.nickname = this._nickname
        comments.push(comment)
        this.setState({ comments })
        this._saveComments(comment)
    }

    render() {
        return (
            <div className='wrapper'>
                <CommentInput
                    onSubmit={ (comment) => this.handleSubmitComment(comment) }>
                </CommentInput>
                <CommnetList comments={ this.state.comments }></CommnetList>
            </div>
        )
    }
}

export default CommentApp