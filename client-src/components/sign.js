import {observer} from "mobx-react"
import {currentUser} from "./current-user"
import cookie from 'react-cookie';

export class SignupPage extends React.Component {
  render() {
    return (
        <div className="col-sm-12">
          <form className="form-signup">
            <h2 className="form-signup-heading">Please sign up</h2>
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required ref="email" />
            <label htmlFor="inputUsername" className="sr-only">Username address</label>
            <input type="username" id="inputUsername" className="form-control" placeholder="Username address" required ref="username" />
            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <input type="password" id="inputPassword" className="form-control" placeholder="Password" required ref="password" />
            <div className="checkbox">
              <input id="rememberMe" type="checkbox" value="remember-me" />
              <label htmlFor="rememberMe"> Remember me</label>
            </div>
            <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={this.handleClick.bind(this)}>Sign up</button>
          </form>
        </div>
    )
  }

  handleClick(ev) {
    ev.preventDefault()
    $.post( "/api/Clients", {
      "username": this.refs.username.value,
      "email": this.refs.email.value,
      "password": this.refs.password.value
    }, function(data) {
      // TODO
      // fixme!
      // XXX
      // Router.browserHistory.push('/signin')
    })
  }
}

observer(SignupPage)

export class SignoutPage extends React.Component {

  componentDidMount() {
    if (currentUser.has('token')) {
      cookie.remove('currentUser')
      currentUser.clear()
    }
  }

  render() {
    return (
      <div className="col-sm-12">
        Logged out!
      </div>
    )
  }

}

observer(SignoutPage)

export class SigninPage extends React.Component {
  render() {
    const loggedIn =
      <form className="form-signin">
        <h2 className="form-signin-heading">Please sign in</h2>
        <label htmlFor="inputUsername" className="sr-only">Username</label>
        <input type="username" id="inputUsername" className="form-control" placeholder="Username" required ref="username" />
        <label htmlFor="inputPassword" className="sr-only">Password</label>
        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required ref="password" />
        <div className="checkbox">
          <input id="rememberMe" type="checkbox" value="remember-me" ref="rememberMe" />
          <label htmlFor="rememberMe"> Remember me</label>
        </div>
        <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={this.handleClick.bind(this)}>Sign in</button>
      </form>

    const loggedOut = <h2>Welcome {currentUser.username}</h2>

    return (
      <div className="col-sm-12">
        { currentUser.has("token") ? loggedOut : loggedIn }
      </div>
    )
  }

  handleClick(ev) {
    ev.preventDefault()
    const rememberMe = this.refs.rememberMe.value
    $.post( "/api/Clients/login", {
      "username": this.refs.username.value,
      "password": this.refs.password.value
    }, (token) => {
      currentUser.clear()
      currentUser.merge({
        username: this.refs.username.value,
        token: token
      })
      cookie.save('currentUser', currentUser, { path: '/' });
      console.log(rememberMe)
      cookie.save('rememberMe', (rememberMe == 'remember-me' ? true : false), { path: '/' });
    })
  }
}

observer(SigninPage)
