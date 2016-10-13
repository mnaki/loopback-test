import {observer} from "mobx-react"
import {currentToken} from "./token"

export class SignupPage extends React.Component {
  render() {
    return (
        <div className="col-sm-12">
          { currentToken.has("id") ||
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
          }
          { currentToken.has("id") &&
            <h2>You are already logged in</h2>
          }
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
      // Router.browserHistory.push('/signin')
    })
  }
}

observer(SignupPage)

export class SignoutPage extends React.Component {

  componentDidMount() {
    cookie.remove('currentToken')
    currentToken.clear()
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
    return (
      <div className="col-sm-12">
        { currentToken.has("id") ||
          <form className="form-signin">
            <h2 className="form-signin-heading">Please sign in</h2>
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
            <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={this.handleClick.bind(this)}>Sign in</button>
          </form>
        }
        { currentToken.has("id") &&
          <h2>You are already logged in</h2>
        }
      </div>
    )
  }

  handleClick(ev) {
    ev.preventDefault()
    $.post( "/api/Clients/login", {
      "username": this.refs.username.value,
      "email": this.refs.email.value,
      "password": this.refs.password.value
    }, function(data) {
      console.log(data)
      currentToken.clear()
      currentToken.merge(data)
      cookie.save('currentToken', data, { path: '/' });
    })
  }
}

observer(SigninPage)
