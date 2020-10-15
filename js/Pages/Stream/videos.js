import React, {Component} from 'react'
import Video from './Video'

class Videos extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rVideos: [],
      remoteStreams: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.remoteStreams !== nextProps.remoteStreams) {
      //remote videos (rvideos). meng-map remote stream untuk masing2 remote videos atau user2 yang sudah terhubung
      //untuk mendapatkan frame (component video) masing2 pada index page
      let _rVideos = nextProps.remoteStreams.map((rVideo, index) => {
        let video = <Video
          videoStream={rVideo.stream}
          frameStyle={{ width: 120, float: 'left', padding: '0 3px' }}
          videoStyles={{
            cursor: 'pointer',
            objectFit: 'cover',
            borderRadius: 3,
            width: '100%',
          }}
        />

        return (
          <div
            id={rVideo.name}
            onClick={() => this.props.switchVideo(rVideo)} //switch video untuk memilih video yang masih aktif untuk di urutkan ke bagian paling depan
            style={{ display: 'inline-block' }}
            key={index}
          >
            {video}
          </div>
        )
      })

      //jika sudah menerima props dari parent (index)
      this.setState({
        remoteStreams: nextProps.remoteStreams, //set state remote stream (pada component video adalah video stream untuk ref video)
        rVideos: _rVideos //set state video
      })
    }
  }

  render() {
    return (
      <div
        style={{
          zIndex: 3,
          position: 'fixed',
          padding: '6px 3px',
          backgroundColor: 'rgba(0,0,0,0.3)',
          maxHeight: 120,
          top: 'auto',
          right: 10,
          left: 10,
          bottom: 10,
          overflowX: 'scroll',
          whiteSpace: 'nowrap'
        }}
      >
        { this.state.rVideos }
      </div>
    )
  }

}

export default Videos