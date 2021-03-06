import Dropzone from "../dropzone/dropzone.min.js"
import "../dropzone/basic.min.css"
import "../dropzone/dropzone.min.css"
import {observer} from "mobx-react"
import {VideoStore, videoStore} from "./video-store.js"
import {currentUser} from "./current-user"

import Webcam from "react-webcam"

export class VideoUploader extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isRecording: false
    }
  }

  componentDidMount() {
    if (currentUser.has('token')) {
      this.dropzone = new Dropzone("#my-awesome-dropzone", {
        url: "/api/Containers/video-container/upload",
        renameFilename: function (filename) {
            return "_" + ".webm";
        }
      })
      this.dropzone.on("complete", (file) => videoStore.fetchVideosByOwner(currentUser.get('id')))
      this.dropzone.on('sending', function (file, xhr, formData) {
      });
    }
  }

  render() {
    const isRecording =
      <button type="button" className="btn btn-default btn-lg" onClick={this.startRecording.bind(this)}>
        <span className="icon-video"></span> Start
      </button>

    const isNotRecording =
      <button type="button" className="btn btn-default btn-lg" onClick={this.stopRecording.bind(this)}>
        <span className="icon-check"></span> Stop
      </button>

    const loggedIn =
      <div className="row">
        <h2>Videos</h2>

        <div className="col-sm-12 col-md-6">
          <div className="col-sm-12 embed-responsive embed-responsive-16by9" style={{ backgroundColor: '#000' }}>
            <Webcam ref="webcam" screenshotFormat="image/jpeg" muted={true} audio={true} className="embed-responsive-item" />
          </div>
          <div className="row">
            <div className="col-sm-12">
              <br />
              { this.state.isRecording ? isNotRecording : isRecording }
              <br />
            </div>
          </div>
        </div>

        <div className="col-sm-12 col-md-6">
          <div className="col-sm-12">
            <form className="dropzone" id="my-awesome-dropzone"></form>
          </div>
        </div>

      </div>

    const loggedOut = <h2>You must be logged in!</h2>

    return (
      <div className="col-sm-12 animated slideInLeft">
        { currentUser.has("token") ? loggedIn : loggedOut }
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
    this.setState({
      isRecording: true
    })
    this.mediaRecorder = new MediaRecorder(this.refs.webcam.stream)
    this.chunks = []
    this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data)
    this.mediaRecorder.start()
    this.screenshot = this.refs.webcam.getScreenshot()
    this.timeout = setTimeout(() => this.mediaRecorder.stop(), 5000)
    this.mediaRecorder.onstop = (e) => {
      this.setState({
        isRecording: false
      })
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
    if (this.state.isRecording)  {
      clearTimeout(this.timeout)
      this.mediaRecorder.stop()
    }
  }

}

Dropzone.autoDiscover = false
