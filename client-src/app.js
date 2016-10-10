import React from "react"
import { Router, Route, IndexRoute, Link, History } from "react-router"
import createBrowserHistory from 'history/lib/createBrowserHistory'
import $ from "jquery"
import 'bootstrap/dist/css/bootstrap.css'
import Dropzone from './dropzone/dropzone.min.js'
import './dropzone/basic.min.css'
import './dropzone/dropzone.min.css'
import ReactDOM from 'react-dom'
import {observable, observe, extendObservable} from 'mobx'
import Webcam from 'react-webcam'

var Home = React.createClass({
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
    fetch('/api/Videos').then((res) => {
      return res.json()
    }).then((res) => {
      this.videos.replace(res)
    })
  }

  deleteVIdeo(video) {
    var request = new Request('/api/Videos/' + video.id, {
      method: 'DELETE',
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'text/json'
      })
    })
    fetch(request).then((res) => {
      return res.json()
    }).then((res) => {
      var request = new Request('/api/Containers/video-container/files/' + video.filename, {
        method: 'DELETE',
        mode: 'cors',
        redirect: 'follow',
        headers: new Headers({
          'Content-Type': 'text/json'
        })
      })
      fetch(request).then((res) => {
        return res.json()
      })

      this.videos.remove(video)
    })
  }

}

var videoStore = window.store = new VideoStore()

class Videos extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    console.log('mounting')
    this.setState({
      dropzone: new Dropzone("#my-awesome-dropzone", {
        url: "/api/Containers/video-container/upload",
        renameFilename: function (filename) {
            return new Date().getTime() + '_' + ".jpeg";
        }
      })
    }, this.initDropzone)
  }

  initDropzone() {
    this.state.dropzone.on("complete", (file) => videoStore.fetchVideos())
  }

  render() {
    return (
      <div className="container">
        <h2>Videos</h2>
        <Webcam ref="webcam" screenshotFormat='image/jpeg' audio="false" muted="true" />
        <button type="button" className="btn btn-default" onClick={this.screenshot.bind(this)}>Screenshot</button>
        <form className="dropzone" id="my-awesome-dropzone"></form>
        <VideoList store={videoStore} />
      </div>
    )
  }

  dataURItoBlob(dataURI) {
    'use strict'
    var byteString,
        mimestring

    if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
        byteString = atob(dataURI.split(',')[1])
    } else {
        byteString = decodeURI(dataURI.split(',')[1])
    }

    mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0]

    var content = new Array();
    for (var i = 0; i < byteString.length; i++) {
        content[i] = byteString.charCodeAt(i)
    }

    return new Blob([new Uint8Array(content)], {type: mimestring});
}

  screenshot() {
    let imageData = this.refs.webcam.getScreenshot()
    let myFile = {
      name: 'screenshot-image.jpeg',
      size: 0
    }
    this.state.dropzone.emit("thumbnail", myFile, imageData)
    this.state.dropzone.addFile(this.dataURItoBlob(imageData))
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
      <div className="col sm-12">
        <button type="button" className="btn btn-default" onClick={this.refreshVideos.bind(this)}>
          Refresh
        </button>
        {
          this.props.store.videos.map((video, i) => {
            return (
              <div key={video.id}>
                <h3>{video.filename}</h3>
                <button type="button" className="btn btn-danger" onClick={this.deleteVideo.bind(this, video)}>
                  Delete
                </button>
                <div className="col sm-2">
                  <video width="300" data-controls data-autoplay>
                    <source src={'/api/Containers/video-container/download/' + video.filename} />
                  </video>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

}

var NavBar = React.createClass({
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

var App = React.createClass({
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