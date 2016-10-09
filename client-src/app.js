import React from "react"
import { Router, Route, IndexRoute, Link, History } from "react-router"
import createBrowserHistory from 'history/lib/createBrowserHistory'
import $ from "jquery"
import 'bootstrap/dist/css/bootstrap.css'
import Dropzone from './dropzone/dropzone.min.js'
import './dropzone/basic.min.css'
import './dropzone/dropzone.min.css'

var Home = React.createClass({
  render() {
    return (
      <div>
        <h2>Home</h2>
      </div>
    )
  }
})

var Videos = React.createClass({
  render() {
    return (
      <div>
        <h2>Videos</h2>
        <form action="/api/Containers/video-container/upload" className="dropzone" id="my-awesome-dropzone"></form>
      </div>
    )
  }
})

var NavBar = React.createClass({
  render () {
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
  render() {
    return (
      <div>
        <NavBar />
        {this.props.children}
      </div>
    )
  }
})

React.render(
  <Router history={createBrowserHistory()}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="videos" component={Videos}></Route>
    </Route>
  </Router>,
  document.getElementById("app")
)