import {observer} from "mobx-react"
import {videoStore} from "./video-store.js"
import {currentUser} from "./current-user"

import Video from "react-html5video"
import "react-html5video/dist/ReactHtml5Video.css"

export class VideoList extends React.Component {

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
      <div className="">
        { currentUser.has("token") && this.props.store.videos.map(this.eachVideo.bind(this)) }
      </div>
    )
  }

  eachVideo = (video, i) => {
    console.log(video)
    return (
      <div key={video.id} className="col-md-6 animated bounce">
        <div className="row">
          <div className="col-sm-12">
            <button type="button" className="btn btn-danger" onClick={this.deleteVideo.bind(this, video)}>
              <span className="icon-garbage"></span> Remove
            </button>
          </div>
        </div>
        <Video autoPlay={true} height="200" muted={true}
          poster={video.filename}
          onCanPlayThrough={() => {
            // console.log("Can play")
          }}
        >
          <source src={video.filename} type="video/webm" />
        </Video>
      </div>
    )
  }

}

observer(VideoList)
