import {observer} from "mobx-react"
import {videoStore} from "./video-store.js"
import {currentUser} from "./current-user"
import {VideoList} from "./video-list"
import {VideoUploader} from "./video-uploader"

export class MyVideosPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    videoStore.fetchVideosByOwner(currentUser.get('id'))
  }

  render() {
    return (
      <div>
        <h2>My videos</h2>
        <VideoUploader />
        <VideoList store={videoStore} />
      </div>
    )
  }

}

observer(MyVideosPage)
