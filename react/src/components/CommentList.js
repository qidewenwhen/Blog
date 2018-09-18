import React, { Component } from 'react'
import Comment from '@/components/Comment'


class CommentList extends Component {
    static defaultProps = {
        comments: []
    }
    render() {
        // const comments = [
        //     {nickname: 'J', content: 'Hello'},
        //     {nickname: 'T', content: 'Hi'}
        // ]
        return (
            <div>
                { this.props.comments.map((comment, i) => <Comment comment={ comment } key={i}></Comment>)}
            </div>
        )
    }
}

export default CommentList