import React from "react"
import { Router, Route, IndexRoute, Link, History } from "react-router"
import createBrowserHistory from "history/lib/createBrowserHistory"
import ReactDOM from "react-dom"

import $ from "jquery"

import "bootstrap/dist/css/bootstrap.css"

import Dropzone from "./dropzone/dropzone.min.js"
import "./dropzone/basic.min.css"
import "./dropzone/dropzone.min.css"

import {observable, observe, extendObservable} from "mobx"

import Webcam from "react-webcam"
import Video from "react-html5video"
import "react-html5video/dist/ReactHtml5Video.css"

import "./gonzocons.css"

/****************************************/

let Home = React.createClass({
  render() {
    return (
      <div>
        <h2>Home</h2>
      </div>
    )
  }
})

class VideoStore {

  videos = observable([])

  fetchVideos() {
    fetch("/api/Videos").then((res) => {
      return res.json()
    }).then((res) => {
      this.videos.replace(res)
    })
  }

  deleteVIdeo(video) {
    let request = new Request("/api/Videos/" + video.id, {
      method: "DELETE",
      mode: "cors",
      redirect: "follow",
      headers: new Headers({
        "Content-Type": "text/json"
      })
    })
    fetch(request).then((res) => {
      return res.json()
    }).then((res) => {
      let request = new Request("/api/Containers/video-container/files/" + video.filename, {
        method: "DELETE",
        mode: "cors",
        redirect: "follow",
        headers: new Headers({
          "Content-Type": "text/json"
        })
      })
      fetch(request).then((res) => {
        return res.json()
      })

      this.videos.remove(video)
    })
  }

}

let videoStore = window.store = new VideoStore()

class Videos extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isRecording: false
    }
  }

  componentDidMount() {
    console.log("mounting")
    this.dropzone = new Dropzone("#my-awesome-dropzone", {
      url: "/api/Containers/video-container/upload",
      renameFilename: function (filename) {
          return "_" + ".webm";
      }
    })
    this.dropzone.on("complete", (file) => videoStore.fetchVideos())
  }

  render() {
    return (
      <div className="container col-sm-12">
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
    observe(props.store.videos, (change) => {
      this.forceUpdate()
    })
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
        {
          this.props.store.videos.map((video, i) => {
            return (
              <div key={video.id} className="col-sm-12 col-md-6">
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

let NavBar = React.createClass({
  render: function () {
    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">Brand</a>
        </div>
        <div className="container">
          <ul className="nav navbar-nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/videos">Videos</Link></li>
          </ul>
        </div>
      </nav>
    )
  }
})

let App = React.createClass({
  render: function () {
    return (
      <div>
        <NavBar />
        {this.props.children}
      </div>
    )
  }
})

ReactDOM.render(
  <Router history={createBrowserHistory()}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="videos" component={Videos}></Route>
    </Route>
  </Router>,
  document.getElementById("app")
)