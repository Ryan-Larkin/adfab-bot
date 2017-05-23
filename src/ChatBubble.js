import React, { Component } from 'react'


//setting the custom styles for the chat bubbles
const styles = {
  chatbubble: {
    background: "linear-gradient(to left, #fcff00, #fdff99)",
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
    fontWeight: '600',
    boxShadow: '-1px 1px 1px #4B4C00'
    },
  chatbubbleOrientationNormal: {
    float: 'right'
  },
  recipientChatbubble : {
    background: 'linear-gradient(to right, #e4e4e4, #CDCDCD)',
    boxShadow: '2px 2px 2px grey'
  },
  recipientChatbubbleOrientationNormal: {
    float: 'left'
  },
  p: {
    color: 'black',
    fontSize: 24,
    margin: 0,
    lineHeight : 1.2,
    wordBreak: 'break-word'
  },
  img: {
    justifyContent: 'center',
    alignSelf: 'center',
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
            <img src="http://connect.adfab.fr/wp-content/uploads/2015/07/logo_adfab.png" id="logo" height="40px" alt="" width="40px"/>
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
