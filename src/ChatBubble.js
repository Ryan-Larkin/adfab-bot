import React, { Component } from 'react'

const styles = {
  chatbubble: {
    backgroundColor: "#fcff00",
    borderRadius: 20,
    clear: 'both',
    marginTop: 1,
    marginRight: 'auto',
    marginBottom: 1,
    marginLeft: 'auto',
    maxWidth: '70%',
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    width: '-webkit-fit-content',
    display: 'flex',
  },
  chatbubbleOrientationNormal: {
    float: 'right'
  },
  recipientChatbubble : {
    backgroundColor: '#ccc'
  },
  recipientChatbubbleOrientationNormal: {
    float: 'left'
  },
  p: {
    color: 'black',
    fontSize: 20,
    margin: 0,
    lineHeight : 1.2
  }
}

export default class ChatBubble extends Component {
  constructor(props) {
    super()
    this.state = {
      message: props.message,
      bubbleStyles: props.bubbleStyles?
        {
          text: props.bubbleStyles.text?props.bubbleStyles.text:{},
          chatbubble: props.bubbleStyles.chatbubble?props.bubbleStyles.chatbubble:{},
          userBubble: props.bubbleStyles.userBubble?props.bubbleStyles.userBubble:{}
        }
        : {text:{},chatbubble:{}}
    }
  }


  render() {
    if (this.props.message.id) {
        var message = this.props.message.message
        return (
          <div style={Object.assign({},
            styles.chatbubble,
            styles.recipientChatbubble,
            (this.props.bubblesCentered?{}:styles.recipientChatbubbleOrientationNormal),
            this.state.bubbleStyles.chatbubble
          )}>
          {/* <img src="http://connect.adfab.fr/wp-content/uploads/2015/07/logo_adfab.png" height="50px" weight="50px"/> */}
            <p style={Object.assign({},styles.p, this.state.bubbleStyles.text)} dangerouslySetInnerHTML={{__html: message}}></p>
          </div>
        )
    } else {
      return (
        <div style={Object.assign({},
          styles.chatbubble,
          (this.props.bubblesCentered?{}:styles.chatbubbleOrientationNormal),
          this.state.bubbleStyles.chatbubble,
          this.state.bubbleStyles.userBubble
        )}>
          <p style={Object.assign({},styles.p, this.state.bubbleStyles.text)}>{this.props.message.message}</p>
        </div>
      )
    }
  }
}
