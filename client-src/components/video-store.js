import {observable, observe} from "mobx"

export class VideoStore {

  videos = observable([])

  fetchVideos() {
    fetch("/api/Videos?filter[include]=owner").then((res) => {
      return res.json()
    }).then((res) => {
      this.videos.clear()
      this.videos.replace(res)
    })
  }

  fetchVideosByOwner(ownerId) {
    fetch("/api/Clients/"+ownerId+"/videos?filter[include]=owner").then((res) => {
      return res.json()
    }).then((res) => {
      this.videos.clear()
      this.videos.replace(res)
    })
  }

  deleteVIdeo(video) {
    fetch("/api/Videos/" + video.id, {
      method: "DELETE",
      mode: "cors",
      redirect: "follow",
      headers: new Headers({ "Content-Type": "text/json" })
    }).then((res) => {
      let v = this.videos.find((x) => x.id == video.id)
      this.videos.remove(v)
    })
  }

}


let videoStore = new VideoStore()

export {videoStore}
