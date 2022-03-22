import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import './App.scss';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { USER_LOGIN_REQUEST_SUCCESS } from './redux/constants';
const loading = () => {
  return <div className="animated fadeIn pt-3 text-center">Loading...</div>;
};
// Containers
const DefaultLayout = Loadable({
  loader: () => import('./containers/DefaultLayout'),
  loading
});

// Pages

const Login = Loadable({
  loader: () => import('./views/Pages/Login'),
  loading
});

const Page404 = Loadable({
  loader: () => import('./views/Pages/Page404'),
  loading
});

const Page500 = Loadable({
  loader: () => import('./views/Pages/Page500'),
  loading
});
const ForgotPassword = Loadable({
  loader: () => import('./views/Pages/ForgotPassword'),
  loading
});
const ResetPassword = Loadable({
  loader: () => import('./views/Pages/ResetPassword'),
  loading
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLogin: null
    };
  }
  async componentDidMount() {
    const response = JSON.parse(await sessionStorage.getItem('user'));
    this.props.dispatch({
      type: USER_LOGIN_REQUEST_SUCCESS,
      payload: response
    });
    this.setState({ userLogin: response });
  }
  async componentWillReceiveProps(nextProps) {
    const { user = {} } = nextProps;
    if (user) {
      await sessionStorage.setItem('user', JSON.stringify(user));
      this.setState({ userLogin: nextProps.user });
    } else {
      await sessionStorage.removeItem('user');
      this.setState({ userLogin: {} });
    }
  }
  render() {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>App")
    return (
      <HashRouter>
        <Switch>
          {!isEmpty(this.state.userLogin) ? (
            <Switch>
              <Route path="/home" name="Home" component={DefaultLayout} />
            </Switch>
          ) : (
            <Switch>
              <Route exact path="/" name="Login Page" component={Login} />
              <Route exact path="/login" name="Login Page" component={Login} />
              <Route
                exact
                path="/forgotPassword"
                name="Forgot Password Page"
                component={ForgotPassword}
              />
              <Route
                exact
                path="/resetPassword/:id"
                name="Reset Password Page"
                component={ResetPassword}
              />
              <Route exact path="/404" name="Page 404" component={Page404} />
              <Route exact path="/500" name="Page 500" component={Page500} />
            </Switch>
          )}
        </Switch>
      </HashRouter>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user.user
  };
}

export default connect(mapStateToProps)(App);
