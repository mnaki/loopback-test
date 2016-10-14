import {observer} from "mobx-react"
import {videoStore} from "./video-store.js"
import {currentUser} from "./current-user"

import Video from "react-html5video"
import "react-html5video/dist/ReactHtml5Video.css"

export class VideoList extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
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
    return (
      <div key={video.id} index={i} className="col-sm-12 col-md-4 animated bounce">
        <br />
        <div className="embed-responsive embed-responsive-16by9">
          <Video autoPlay={false} height="200" poster={video.filename} loop={false} controls={true} className="embed-responsive-item">
            <source src={video.filename} type="video/webm" />
          </Video>
        </div>
        <br />
        <button type="button" className="btn btn-danger" onClick={this.deleteVideo.bind(this, video)}>
          <span className="icon-garbage"></span> Remove
        </button>
      </div>
    )
  }

}

observer(VideoList)
