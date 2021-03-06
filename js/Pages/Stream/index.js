import React, { Component } from 'react';

import io from 'socket.io-client'

import Video from './video'
import Videos from './videos'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      localStream: null,    // used to hold local stream object to avoid recreating the stream everytime a new offer comes
      remoteStream: null,    // used to hold remote stream object that is displayed in the main screen

      remoteStreams: [],    // holds all Video Streams (all remote streams)
      peerConnections: {},  // holds all Peer Connections
      selectedVideo: null,

      status: 'Please wait...',

      pc_config: {
        "iceServers": [
          {
            urls: 'stun:stun.l.google.com:19302'
          }
        ]
      },

      sdpConstraints: {
        'mandatory': {
          'OfferToReceiveAudio': true,
          'OfferToReceiveVideo': true
        }
      },
    }

    // URL untuk serving socketio signalling
    this.serviceIP = 'https://541f473720a7.ngrok.io/webrtcPeer'

    this.socket = null
  }

  getLocalStream = () => {
    // called when getUserMedia() successfully returns - see below
    // getUserMedia() returns a MediaStream object (https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)
    const success = (stream) => {
      window.localStream = stream
      // this.localVideoref.current.srcObject = stream
      // this.pc.addStream(stream);
      this.setState({
        localStream: stream
      })

      this.whoisOnline()
    }

    // called when getUserMedia() fails - see below
    const failure = (e) => {
      console.log('getUserMedia Error: ', e)
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    // see the above link for more constraint options
    const constraints = {
      // audio: true,
      video: true,
      options: {
        mirror: true,
      }
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    navigator.mediaDevices.getUserMedia(constraints)
      .then(success)
      .catch(failure)
  }

  whoisOnline = () => {
    // mengirim id ke peer lain untuk memberitahu sedang online
    this.sendToPeer('onlinePeers', null, { local: this.socket.id })
  }

  //method untuk mengirim ke socketio
  sendToPeer = (messageType, payload, socketID) => {
    this.socket.emit(messageType, {
      socketID,
      payload
    })
  }

  createPeerConnection = (socketID, callback) => {

    try {
      let pc = new RTCPeerConnection(this.state.pc_config)

      // add pc to peerConnections object
      const peerConnections = { ...this.state.peerConnections, [socketID]: pc }
      this.setState({
        peerConnections
      })

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          this.sendToPeer('candidate', e.candidate, {
            local: this.socket.id,
            remote: socketID
          })
        }
      }

      pc.ontrack = (e) => {
        const remoteVideo = {
          id: socketID,
          name: socketID,
          stream: e.streams[0]
        }

        this.setState(prevState => {

          // If we already have a stream in display let it stay the same, otherwise use the latest stream
          const remoteStream = prevState.remoteStreams.length > 0 ? {} : { remoteStream: e.streams[0] }

          // get currently selected video
          let selectedVideo = prevState.remoteStreams.filter(stream => stream.id === prevState.selectedVideo.id)
          // if the video is still in the list, then do nothing, otherwise set to new video stream
          selectedVideo = selectedVideo.length ? {} : { selectedVideo: remoteVideo }

          return {
            // selectedVideo: remoteVideo,
            ...selectedVideo,
            // remoteStream: e.streams[0],
            ...remoteStream,
            remoteStreams: [...prevState.remoteStreams, remoteVideo]
          }
        })
      }

      pc.close = () => {
        // alert('GONE')
      }

      if (this.state.localStream)
        pc.addStream(this.state.localStream)

      // return pc
      callback(pc)

    } catch (e) {
      console.log('Something went wrong! pc not created!!', e)
      // return;
      callback(null)
    }
  }

  componentDidMount = () => {

    this.socket = io.connect(
      this.serviceIP,
      {
        path: '/io/webrtc',
        query: {}
      }
    )

    this.socket.on('connection-success', data => {

      this.getLocalStream()

      console.log(data.success)
      const status = data.peerCount > 1 ? `Total Connected Peers: ${data.peerCount}` : 'Waiting for other peers to connect'

      this.setState({
        status: status
      })
    })

    this.socket.on('peer-disconnected', data => {
      console.log('peer-disconnected', data)

      const remoteStreams = this.state.remoteStreams.filter(stream => stream.id !== data.socketID)

      this.setState(prevState => {
        // check if disconnected peer is the selected video and if there still connected peers, then select the first
        const selectedVideo = prevState.selectedVideo.id === data.socketID && remoteStreams.length ? { selectedVideo: remoteStreams[0] } : null

        return {
          // remoteStream: remoteStreams.length > 0 && remoteStreams[0].stream || null,
          remoteStreams,
          ...selectedVideo,
        }
      }
      )
    });

    this.socket.on('online-peer', socketID => {
      console.log('connected peers ...', socketID)

      // create and send offer to the peer (data.socketID)
      // 1. Create new pc
      this.createPeerConnection(socketID, pc => {
        // 2. Create Offer
        if (pc)
          pc.createOffer(this.state.sdpConstraints)
            .then(sdp => {
              pc.setLocalDescription(sdp)

              this.sendToPeer('offer', sdp, {
                local: this.socket.id,
                remote: socketID
              })
            })
      })
    })

    this.socket.on('offer', data => {
      this.createPeerConnection(data.socketID, pc => {
        pc.addStream(this.state.localStream)

        pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(() => {
          // 2. Create Answer
          pc.createAnswer(this.state.sdpConstraints)
            .then(sdp => {
              pc.setLocalDescription(sdp)

              this.sendToPeer('answer', sdp, {
                local: this.socket.id,
                remote: data.socketID
              })
            })
        })
      })
    })

    this.socket.on('answer', data => {
      // get remote's peerConnection
      const pc = this.state.peerConnections[data.socketID]
      console.log(data.sdp)
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(() => { })
    })

    this.socket.on('candidate', (data) => {
      // get remote's peerConnection
      const pc = this.state.peerConnections[data.socketID]

      if (pc)
        pc.addIceCandidate(new RTCIceCandidate(data.candidate))
    })

  };

  switchVideo = (_video) => {
    console.log(_video)
    this.setState({
      selectedVideo: _video
    })
  }

  render() {

    console.log(this.state.localStream)

    const statusText = <div style={{ color: 'yellow', padding: 5 }}>{this.state.status}</div>

    return (
      <div>
        {/* untuk local stream (user stream) */}
        <Video
          videoStyles={{
            zIndex: 2,
            position: 'absolute',
            right: 0,
            width: 200,
            height: 200,
            margin: 5,
            backgroundColor: 'black'
          }}
          // ref={this.localVideoref}
          videoStream={this.state.localStream}
          autoPlay muted>
        </Video>
        {/* untuk selected stream (remote stream yang di-select untuk di layar besar) */}
        <Video
          videoStyles={{
            zIndex: 1,
            position: 'fixed',
            bottom: 0,
            minWidth: '100%',
            minHeight: '100%',
            backgroundColor: 'black'
          }}
          videoStream={this.state.selectedVideo && this.state.selectedVideo.stream}
          autoPlay>
        </Video>
        <br />
        <div style={{
          zIndex: 3,
          position: 'absolute',
          margin: 10,
          backgroundColor: '#cdc4ff4f',
          padding: 10,
          borderRadius: 5,
        }}>
          {statusText}
        </div>
        <div>
          {/* untuk remote streams (other user streams/connected peers) */}
          <Videos
            switchVideo={this.switchVideo}
            remoteStreams={this.state.remoteStreams}
          ></Videos>
        </div>
        <br />
      </div>
    )
  }
}

export default App;