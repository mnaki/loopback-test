import React from "react"
import { Router, Route, IndexRoute, Link, History } from "react-router"
import createBrowserHistory from "history/lib/createBrowserHistory"
import ReactDOM from "react-dom"

import cookie from 'react-cookie';

import $ from "jquery"

import "bootstrap/dist/css/bootstrap.css"

import {observer} from "mobx-react"

import "./gonzocons.css"

import "animate.css"

import {currentUser} from "./components/current-user"
import {SigninPage, SignoutPage, SignupPage} from "./components/sign.js"
import {VideoPage} from "./components/video-page.js"
import {HomePage} from "./components/home-page.js"

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
            { !currentUser.has('token') && <li><Link to="/signup">Signup</Link></li> }
            { !currentUser.has('token') && <li><Link to="/signin">Signin</Link></li> }
            { currentUser.has('token') && <li><Link to="/signout">Signout</Link></li> }
          </ul>
        </div>
      </nav>
    )
  }
})

observer(NavBar)

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    if (cookie.load('rememberMe')) {
      currentUser.merge(cookie.load('currentUser') || {})
      window.currentUser = currentUser
    } else {
      currentUser.clear()
      currentUser.merge({})
    }
  }

  render() {
    return (
      <div>
        <NavBar />
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }

}

observer(App)

ReactDOM.render(
  <Router history={createBrowserHistory()}>
    <Route path="/" component={App}>
      <IndexRoute component={HomePage} />
      <Route path="signout" component={SignoutPage}></Route>
      <Route path="signup" component={SignupPage}></Route>
      <Route path="signin" component={SigninPage}></Route>
      <Route path="videos" component={VideoPage}></Route>
    </Route>
  </Router>,
  document.getElementById("app")
)
