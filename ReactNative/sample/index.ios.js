// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  * @flow
//  */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeModules,
  requireNativeComponent,
  Alert,
  Dimensions,
  DeviceEventEmitter
} from 'react-native';

var ReactNative = require('react-native');                
// const AuroraIController = NativeModules.AuroraIMUIModule;
import IMUI from 'aurora-imui-react-native'
var InputView = IMUI.ChatInput;
var MessageListView = IMUI.MessageList;
const AuroraIController = IMUI.AuroraIMUIController;
const window = Dimensions.get('window');

var themsgid = 1

function constructNormalMessage() {

    var message = {}
    message.msgId = themsgid.toString()
    themsgid += 1
    message.status = "send_going"
    message.isOutgoing = true
    message.timeString = ""
    var user = {
          userId: "",
          displayName: "",
          avatarPath: ""
    }
    message.fromUser = user
    
    return  message
}

export default class TestRNIMUI extends Component {
  constructor(props) {
    super(props);
    this.state = { inputViewLayout: {width:window.width, height:86,}};
    
    this.updateLayout = this.updateLayout.bind(this);
  }

  componentDidMount() {  
    AuroraIController.addMessageListDidLoadListener(() => {

      var messages = []
      for(var i=0; i<14; i++){
        var message = constructNormalMessage()
        message.msgType = "text"
        message.text = "" + i
        AuroraIController.insertMessagesToTop([message])      
    }
    AuroraIController.insertMessagesToTop(messages)
    });
  }

  updateLayout(layout) {
    this.setState({inputViewLayout: layout})
  }

  onAvatarClick = (message) => {
      console.log(message)
    }

  onMsgClick = (message) => {
      console.log(message)
    }
    
  onStatusViewClick = (message) => {
      console.log(message)
      message.status = 'send_succeed'
      message.fromUser.avatarPath = message.mediaPath
      AuroraIController.updateMessage(message)
    }

  onBeginDragMessageList = () => {
      this.updateLayout({width:window.width, height:86,})
      AuroraIController.hidenFeatureView(true)
    }

  onPullToRefresh = () => {
      console.log("on pull to refresh")
    }

  onSendText = (text) => {

    var message = constructNormalMessage()
    
    message.msgType = "text"
    message.text = text
    // message.timeString = 'fsdafafaf'
    
    var user = {
      userId: "fasdf",
      displayName: "asfddsfa",
      avatarPath: ""
    }
    message.fromUser = user
    var evenmessage = constructNormalMessage()
    
    message.msgType = "text"
    message.text = text

    var eventMessage = constructNormalMessage()
    eventMessage.msgType ='event'
    eventMessage.text = "fadsfasfasdfsadfasdf"

    AuroraIController.appendMessages([eventMessage])
    AuroraIController.appendMessages([message])
    AuroraIController.scrollToBottom(true)
  }

  onTakePicture = (mediaPath) => {

    var message = constructNormalMessage()
    message.msgType = "image"
    message.mediaPath = mediaPath

    AuroraIController.appendMessages([message])
    AuroraIController.scrollToBottom(true)
  }

  onStartRecordVoice = (e) => {
    console.log("on start record voice")
  }

  onFinishRecordVoice = (mediaPath, duration) => {
    var message = constructNormalMessage()
    message.msgType = "voice"
    message.mediaPath = mediaPath
    message.duration = duration
    AuroraIController.appendMessages([message])
  }

  onCancelRecordVoice = () => {
    console.log("on cancel record voice")
  }

  onStartRecordVideo = () => {
    console.log("on start record video")
  }

  onFinishRecordVideo = (mediaPath) => {
    var message = constructNormalMessage()

    message.msgType = "video"
    message.mediaPath = mediaPath

    AuroraIController.appendMessages([message])
  }
    
  onSendGalleryFiles = (mediaFiles) => {
    

    /**
     * WARN: 这里返回的是原图，直接插入大会话列表会很大且耗内存.
     * 应该做裁剪操作后再插入到 messageListView 中，
     * 一般的 IM SDK 会提供裁剪操作，或者开发者手动进行裁剪。
     * 
     * 代码用例不做裁剪操作。
     */ 
    for(index in mediaFiles) {
      var message = constructNormalMessage()
      message.msgType = "image"
      message.mediaPath = mediaFiles[index].mediaPath
      AuroraIController.appendMessages([message])
      AuroraIController.scrollToBottom(true)
    }
  }

  onSwitchToMicrophoneMode = () => {
    this.updateLayout({width:window.width, height:256,})
  }

  onSwitchToGalleryMode = () => {
    this.updateLayout({width:window.width, height:256,})
  }

  onSwitchToCameraMode = () => {
    this.updateLayout({width:window.width, height:256,})
  }

  onShowKeyboard = (keyboard_height) => {
    var inputViewHeight = keyboard_height + 86
    this.updateLayout({width:window.width, height:inputViewHeight,})
  }


  onInitPress() {
      console.log('on click init push ');
      this.updateAction();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{height: 64,backgroundColor: '#ff0000'}}/>
        <MessageListView style={styles.messageList}
        onAvatarClick={this.onAvatarClick}
        onMsgClick={this.onMsgClick}
        onStatusViewClick={this.onStatusViewClick}
        onTapMessageCell={this.onTapMessageCell}
        onBeginDragMessageList={this.onBeginDragMessageList}
        onPullToRefresh={this.onPullToRefresh}
        avatarSize={{width:40,height:40}}
        sendBubbleTextSize={18}
        sendBubbleTextColor={"#7587A8"}
        sendBubblePadding={{left:10,top:10,right:15,bottom:10}}
        isShowIncommingDisplayName={true}
        isShowOutgoingDisplayName={true}
        />
        <InputView style={this.state.inputViewLayout}
        onSendText={this.onSendText}
        onTakePicture={this.onTakePicture}
        onStartRecordVoice={this.onStartRecordVoice}
        onFinishRecordVoice={this.onFinishRecordVoice}
        onCancelRecordVoice={this.onCancelRecordVoice}
        onStartRecordVideo={this.onStartRecordVideo}
        onFinishRecordVideo={this.onFinishRecordVideo}
        onSendGalleryFiles={this.onSendGalleryFiles}
        onSwitchToMicrophoneMode={this.onSwitchToMicrophoneMode}
        onSwitchToGalleryMode={this.onSwitchToGalleryMode}
        onSwitchToCameraMode={this.onSwitchToCameraMode}
        onShowKeyboard={this.onShowKeyboard}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  messageList: {
    backgroundColor: 'red',
    flex: 1,
    marginTop: 0,
    width: window.width,
    margin:0,
  },
  inputView: {
    backgroundColor: 'green',
    width: window.width,
    height:100,
    
  },
  btnStyle: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#3e83d7',
    borderRadius: 8,
    backgroundColor: '#3e83d7'
  }
});


AppRegistry.registerComponent('TestRNIMUI', () => TestRNIMUI);
