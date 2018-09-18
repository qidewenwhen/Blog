import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CommentInput extends Component {
    static propTypes = {
        onSubmit: PropTypes.func
    }
    constructor() {
        super()
        this.state = {
            nickname: '',
            content: '',
            topicID: '',
            createdTime: 0
        }
    }
    componentDidMount() {
        this.textarea.focus()
    }
    
    handleContentChange = (e) => {
        this.setState({
            content: e.target.value
        })
    }
    handleSubmit = () => {
        if (this.props.onSubmit) {
            const input = this.state
            input.createdTime = +new Date()
            this.props.onSubmit(input)
        }
        this.setState({ content: ''})
    }
    
    render() {
        return (
            <div className='comment-input'>
                <div className='comment-field'>
                    <span className='comment-field-name'>Comment</span>
                    <div className='comment-field-input'>
                        <textarea 
                            ref={(textarea) => this.textarea = textarea}
                            value={this.state.content} 
                            onChange={ (e) => this.handleContentChange(e) } />
                    </div>
                </div>
                <div className='comment-field-button'>
                    <button
                        onClick={ () => this.handleSubmit() }>
                        Reply
                    </button>
                </div>
            </div>
        )
    }
    
}

export default CommentInput