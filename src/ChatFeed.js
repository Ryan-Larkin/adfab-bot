/* eslint-disable */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import ChatBubble from './ChatBubble.js'
import ChatInput from './ChatInput.js'
import Message from './Message.js'
import config from '../config.json'
const io = require('socket.io-client')
const socket = io(config.domain)


const styles = {
  chatPanel: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    background: 'rgb(250, 250, 250)'
    },
  chatHistory: {
    overflow: 'scroll'
  },
  chatbubbleWrapper: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
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

export default class ChatFeed extends Component {

  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      isTyping: false
    }
  }

componentDidMount = () => {

// receiving the status of the bot from the server
// state is used to track if the loading animation should be displayed
    socket.on('is typing', msg => {
    msg.isTyping ? this.setState({isTyping : true}) : this.setState({isTyping : false})
    })

//waits for custom server response if budget error
  socket.on('budget error', (msg) => {
    var messages = this.state.messages;
    messages.push(new Message({id: 1, message: msg}));
    this.setState({messages : messages});
  });

// waits for custom server response if tech is not used
  socket.on('tech not used', (newMessage) => {
    var messages = this.state.messages;
    messages.push(new Message({id: 1, message: newMessage}));
    this.setState({messages : messages});
  });

// waits for custom server response if tech is unsure
  socket.on('tech unsure', (newMessage) => {
    var messages = this.state.messages;
    messages.push(new Message({id: 1, message: newMessage}));
    this.setState({messages : messages});
  });

// regular response from server : pushes to the message state a new message from the bot
// id 1 is used to track styles and bot messages
  socket.on('chat message', (newMessage) => {
    var messages = this.state.messages;
    messages.push(new Message({id: 1, message: newMessage}));
    this.setState({messages : messages});
  });

// receives the info collected by the server to dynamically set the forms
// pushes the info to the props to interact with the static html from app.js
// web-project-type   e-comm-tech.original

  socket.on('order context', (context) => {
    var projectInfo = {}
    if (context) {
      console.log(context)
      if(context['mobile-type.original']) projectInfo.projectType = context['mobile-type.original']
      if(context['web-type-normal.original']) projectInfo.projectType = context['web-type-normal.original']
      if(context['web-type-ecomm.original']) projectInfo.projectType = context['web-type-ecomm.original']
      if(context['mobile-tech.original']) projectInfo.technologies = context['mobile-tech.original']
      if(context['web-app-tech.original']) projectInfo.technologies = context['web-app-tech.original']
      if(context['e-comm-tech.original']) projectInfo.technologies = context['e-comm-tech.original']
      projectInfo.deadline = context['deadline.original']
      projectInfo.budget = context['budget.original']
      projectInfo.firstName = context['given-name.original']
      projectInfo.lastName = context['last-name.original']
      projectInfo.company = context['company.original']
      projectInfo.city = context['geo-city']
      projectInfo.phoneNumber = context['phone-number.original']
      projectInfo.email = context['email']
      this.props.handleFormData(projectInfo)
    }
  });
}
// handles the scrolling
  _scrollToBottom = () => {
    const {chat} = this.refs;
    const scrollHeight = chat.scrollHeight;
    const height = chat.clientHeight;
    const maxScrollTop = scrollHeight - height;
    ReactDOM.findDOMNode(chat).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

// the next two functions are used to render the chat bubbles
  _renderGroup = (messages, index, id) => {
    var group = []
    for (var i = index; messages[i]?messages[i].id === id:false; i--) {
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
    var message_nodes = messages.map((curr, index) => {
      if (
        (messages[index+1]?false:true) ||
        (messages[index+1].id !== curr.id)
      ) {
        return this._renderGroup(messages, index, curr.id);
      }
    });
    return message_nodes

  }

// function to send messages to the server and to add the user messages to the chat feeds
// passed as a prop to chat input so that the chat input can use it
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

    var inputField = this.props.hasInputField ? <ChatInput userMessage={this._handleMessage} ></ChatInput> : null

    return (
      <div id="chat-panel" style={styles.chatPanel}>
        <div ref="chat" className="chat-history" style={styles.chatHistory}>
          <div className="chat-messages">
            {this._renderMessages(this.state.messages)}
            {/* conditional rendering when the states is set to is typing true */}
            {this.state.isTyping &&
              <ChatBubble message={new Message({id: 1, message: '<img src="default.gif" alt="" width="40px" height="auto">'})} bubbleStyles={this.props.bubbleStyles?this.props.bubbleStyles:{}}/>
            }
          </div>
        </div>
        {inputField}
      </div>
    )
  }
}

// defining the proptypes used for chat feed
ChatFeed.propTypes =  {
  isTyping: PropTypes.bool,
  hasInputField: PropTypes.bool,
  bubblesCentered: PropTypes.bool,
  bubbleStyles: PropTypes.object,
  messages: PropTypes.array.isRequired
}
