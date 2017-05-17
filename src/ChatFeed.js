'use strict';

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import ChatBubble from './ChatBubble.js'
import ChatInput from './ChatInput.js'
import Message from './Message.js'
import config from '../config.json'
const io = require('socket.io-client')
const socket = io(config.domain)

export default class ChatFeed extends Component {

  constructor(props) {
    super(props)
    this.state = {messages: []}
  }

componentDidMount = () => {
  socket.on('chat message', (newMessage) => {

    // if BIG JSON obj from server (aka newMEssage) ontains form data
    // let's pass it up to app.js via this.props.handleFormData.

    var messages = this.state.messages;
    messages.push(new Message({id: 1, message: newMessage}));
    this.setState({messages : messages});
  });
}


  _scrollToBottom = () => {
    const {chat} = this.refs;
    const scrollHeight = chat.scrollHeight;
    const height = chat.clientHeight;
    const maxScrollTop = scrollHeight - height;
    ReactDOM.findDOMNode(chat).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  _renderGroup = (messages, index, id) => {
    var group = []
    for (var i = index; messages[i]?messages[i].id == id:false; i--) {
      group.push(messages[i])
    }
    var message_nodes = group.reverse().map((curr, index) => {
      return <ChatBubble
                key={Math.random().toString(36)}
                message={curr}
                bubblesCentered={this.props.bubblesCentered?true:false}
                bubbleStyles={this.props.bubbleStyles}/>
    })
    return (
      <div key={Math.random().toString(36)} style={styles.chatbubbleWrapper}>
        {message_nodes}
      </div>
    )
  }

  _renderMessages = (messages) => {
    console.log('newMessage', messages);
    var message_nodes = messages.map((curr, index) => {

      // Find diff in message type or no more messages
      if (
        (messages[index+1]?false:true) ||
        (messages[index+1].id != curr.id)
      ) {
        return this._renderGroup(messages, index, curr.id);
      }

    });

    // Other end is typing...
    if (this.props.isTyping) {
      message_nodes.push(
        <div key={Math.random().toString(36)} style={Object.assign({}, styles.recipient, styles.chatbubbleWrapper)}>
          <ChatBubble message={new Message({id:1, message:"..."})} bubbleStyles={this.props.bubbleStyles?this.props.bubbleStyles:{}}/>
        </div>
      )
    }

    // return nodes
    return message_nodes

  }

  _handleMessage = (newMessage) => {
    socket.emit('chat message', newMessage)
    var messages = this.state.messages
    messages.push(new Message({id: 0, message: newMessage}))
    this.setState({ messages : messages})
  }

  render = () => {
    window.setTimeout(() => {
      this._scrollToBottom()
    },10)

    var inputField = this.props.hasInputField ? <ChatInput userMessage={this._handleMessage}></ChatInput> : null

    return (
      <div id="chat-panel" style={styles.chatPanel}>
        <div ref="chat" className="chat-history" style={styles.chatHistory}>
          <div className="chat-messages" >
            {this._renderMessages(this.state.messages)}
          </div>
        </div>
        {inputField}
      </div>
    )
  }
}

const styles = {
  chatPanel: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  chatHistory: {
    overflow: 'scroll'
  },
  chatbubbleWrapper: {
    marginTop: 10,
    marginBottom: 10,
    overflow: 'auto',
    position: 'relative'
  },
  img: {
    borderRadius: 100,
    bottom: 0,
    left: 0,
    position: 'absolute',
    width: 36,
    zIndex: 100,
  }
}

ChatFeed.propTypes =  {
  isTyping: React.PropTypes.bool,
  hasInputField: React.PropTypes.bool,
  bubblesCentered: React.PropTypes.bool,
  bubbleStyles: React.PropTypes.object,
  messages: React.PropTypes.array.isRequired
}
