import Dropzone from "../dropzone/dropzone.min.js"
import "../dropzone/basic.min.css"
import "../dropzone/dropzone.min.css"
import {observer} from "mobx-react"
import {VideoStore, videoStore} from "./video-store.js"
import {currentUser} from "./current-user"

import Webcam from "react-webcam"

import {VideoList} from "./video-list"

export class VideoPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillUpdate(np, ns) {
    this.props.store.fetchVideos()
  }

  render() {
    const loggedIn =
      <div>
        <VideoList store={videoStore} />
      </div>
    const loggedOut = <h2>You must be logged in!</h2>
    return (
      <div className="col-sm-12 animated slideInLeft">
        { currentUser.has("token") ? loggedIn : loggedOut }
      </div>
    )
  }

}

observer(VideoPage)
