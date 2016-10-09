import React from "react"
import { Router, Route, IndexRoute, Link, History } from "react-router"
import createBrowserHistory from 'history/lib/createBrowserHistory'
import $ from "jquery";
import 'bootstrap/dist/css/bootstrap.css';

var Home = React.createClass({
  render() {
    return (
      <h2>Home</h2>
    )
  }
});

var Login = React.createClass({
  render() {
    return (
      <div>
        <h2>Login</h2>
        <button type="button" className="btn btn-default">Login</button>
      </div>
    )
  }
});

var About = React.createClass({
  render() {
    return (
      <div>
        <h2>About</h2>
        {this.props.children}
      </div>
    );
  }
});

var Nested = React.createClass({
  render() {
    return (
      <p>Nested content.</p>
    )
  }
});

var App = React.createClass({
  render() {
    return (
      <div>
        <nav className="navbar navbar-default navbar-static-top">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">Brand</a>
          </div>
          <div className="container">
            <ul className="nav navbar-nav">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/about/nested">About &raquo; Nested</Link></li>
            </ul>
          </div>
        </nav>

        {this.props.children}

      </div>
    );
  }
});

React.render(
  <Router history={createBrowserHistory()}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="about" component={About}>
        <Route path="nested" component={Nested} />
      </Route>
      <Route path="login" component={Login}>
      </Route>
    </Route>
  </Router>,
  document.getElementById("app")
);