import {observable} from "mobx"

export class VideoStore {

  videos = observable([])

  fetchVideos() {
    fetch("/api/Videos").then((res) => {
      return res.json()
    }).then((res) => {
      this.videos.clear()
      this.videos.replace(res)
    })
  }

  fetchVideosByOwner(ownerId) {
    console.log("/api/Client/videos/" + ownerId)
    fetch("/api/Client/videos/" + ownerId).then((res) => {
      return res.json()
    }).then((res) => {
      this.videos.clear()
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
      let request = new Request(video.filename, {
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


let videoStore = new VideoStore()

export {videoStore}
