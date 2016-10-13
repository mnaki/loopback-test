import Dropzone from "../dropzone/dropzone.min.js"
import "../dropzone/basic.min.css"
import "../dropzone/dropzone.min.css"
import {observer} from "mobx-react"
import {VideoStore, videoStore} from "./video-store.js"
import {currentToken} from "./token.js"

import Webcam from "react-webcam"
import Video from "react-html5video"
import "react-html5video/dist/ReactHtml5Video.css"

export class VideoPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isRecording: false
    }
  }

  componentDidMount() {
    if (currentToken.has('id')) {
      this.dropzone = new Dropzone("#my-awesome-dropzone", {
      url: "/api/Containers/video-container/upload",
      renameFilename: function (filename) {
          return "_" + ".webm";
      }
      })
      this.dropzone.on("complete", (file) => videoStore.fetchVideos())
    }
  }

  render() {
    return (
      <div className="col-sm-12 animated slideInLeft">

        { currentToken.has("id") &&
          <div>
            <h2>Videos</h2>
            <Webcam className="col-sm-12" ref="webcam" screenshotFormat="image/jpeg" audio={true} />

              { !this.state.isRecording &&
                <button type="button" className="btn btn-default btn-lg" onClick={this.startRecording.bind(this)}>
                  <span className="icon-video"></span> Start
                </button>
              }
              { !!this.state.isRecording &&
                <button type="button" className="btn btn-default btn-lg" onClick={this.stopRecording.bind(this)}>
                  <span className="icon-check"></span> Stop
                </button>
              }

            <div className="col-sm-12">
              <form className="col-sm-12 dropzone" id="my-awesome-dropzone"></form>
            </div>
            <VideoList store={videoStore} />
          </div>
        }
        { !currentToken.has("id") &&
          <h2>You must be logged in!</h2>
        }
      </div>
    )
  }

  dataURItoBlob(dataURI) {
    let byteString,
        mimestring

    if (dataURI.split(",")[0].indexOf("base64") !== -1 ) {
        byteString = atob(dataURI.split(",")[1])
    } else {
        byteString = decodeURI(dataURI.split(",")[1])
    }

    mimestring = dataURI.split(",")[0].split(":")[1].split(";")[0]

    let content = new Array();
    for (let i = 0; i < byteString.length; i++) {
        content[i] = byteString.charCodeAt(i)
    }

    return new Blob([new Uint8Array(content)], {type: mimestring});
  }

  screenshot() {
    let imageData = this.refs.webcam.getScreenshot()
    let myFile = {
      name: "screenshot-image.jpeg"
    }
    this.dropzone.emit("thumbnail", myFile, imageData)
    this.dropzone.addFile(this.dataURItoBlob(imageData))
  }

  startRecording() {
    console.log("start recording")
    this.setState({
      isRecording: true
    })
    this.mediaRecorder = new MediaRecorder(this.refs.webcam.stream)
    console.log(this.mediaRecorder)
    this.chunks = []
    this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data)
    this.mediaRecorder.start()
    this.screenshot = this.refs.webcam.getScreenshot()
    setTimeout(() => this.mediaRecorder.stop(), 5000)
    this.mediaRecorder.onstop = (e) => {
      this.setState({
        isRecording: false
      })
      console.log("record stoppted")
      let blob = new Blob(this.chunks, { "type" : "video/webm" })
      this.chunks = []
      let videoURL = window.URL.createObjectURL(blob)
      this.dropzone.on("addedfile", (file) => {
        this.dropzone.emit("thumbnail", file, this.screenshot)
      })
      this.dropzone.addFile(blob)
    }
  }

  stopRecording() {
    console.log("stop recording")
    this.mediaRecorder.stop()
  }

}

Dropzone.autoDiscover = false

class VideoList extends React.Component {

  constructor(props) {
    super(props)
    props.store.fetchVideos()
  }

  refreshVideos() {
    this.props.store.fetchVideos()
  }

  deleteVideo(video) {
    this.props.store.deleteVIdeo(video)
  }

  render() {
    return (
      <div>
        <div className="col-sm-12">
          <button type="button" className="col-sm-12 btn btn-default btn-lg" onClick={this.refreshVideos.bind(this)}>
            <span className="icon-share"></span> Refresh
          </button>
        </div>
        { currentToken.has("id") &&
          this.props.store.videos.map((video, i) => {
            return (
              <div key={video.id} className="col-sm-12 col-md-6 animated bounce">
                <div className="col-sm-12">
                  <Video autoPlay={true} muted={true}
                    poster={"/api/Containers/video-container/download/" + video.filename}
                    onCanPlayThrough={() => {
                      // console.log("Can play")
                    }}
                  >
                    <source src={"/api/Containers/video-container/download/" + video.filename}  type="video/webm" />
                  </Video>
                  <button type="button" className="btn btn-danger" onClick={this.deleteVideo.bind(this, video)}>
                    <span className="icon-garbage"></span> Remove
                  </button>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

}

observer(VideoList)