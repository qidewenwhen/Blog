import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Comment extends Component {
    static propTypes = {
        comment: PropTypes.object.isRequired
    }

    constructor() {
        super()
        this.state = { timeSting: '' }
    }

    componentWillMount () {
        this._updateTimeString()
        this._timer = setInterval(
            () => this._updateTimeString(),
            5000
        )
    }

    _updateTimeString() {
        const comment = this.props.comment
        const duration = (+Date.now() - comment.createdTime) / 1000
        this.setState({
            timeString: duration > 60
                ? `${Math.round(duration / 60)} minutes ago`
                : `${Math.round(Math.max(duration, 1))} seconds ago`
        })
    }

    _getProcessedContent(content) {
        return content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/`([\S\s]+?)`/g, '<code>$1</code>')
    }

    render() {
        return (
            <div className='comment'>
                <div className='comment-username'>
                    <span>{ this.props.comment.nickname }</span> : {/*to complete*/}
                </div>
                <p dangerouslySetInnerHTML={{
                    __html: this._getProcessedContent(this.props.comment.content)
                }} />
                <span className='comment-createdtime'>
                    {this.state.timeString}
                </span>
            </div>
        )
    }
}

export default Comment