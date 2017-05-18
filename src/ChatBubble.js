import React, { Component } from 'react'
import marked from 'marked'

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})


const styles = {
  chatbubble: {
    backgroundColor: "#fcff00",
    borderRadius: 20,
    clear: 'both',
    marginTop: 1,
    marginRight: 'auto',
    marginBottom: 1,
    marginLeft: 'auto',
    maxWidth: 425,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 14,
    paddingRight: 14,
    width: '-webkit-fit-content'
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
    fontSize: 16,
    fontWeight: '300',
    margin: 0,
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

  componentDidMount() {}


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
