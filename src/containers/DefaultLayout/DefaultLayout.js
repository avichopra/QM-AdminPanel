import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import {
  AppBreadcrumb,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav
} from '@coreui/react';
import navigation from '../../_nav';
import routes from '../../routes';
import { USER_LOGOUT_REQUEST_SUCCESS } from '../../redux/constants';

const DefaultHeader = React.lazy(() => import('./DefaultHeader'));
class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      token: {}
    };
  }
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  async signOut() {
    await sessionStorage.removeItem('user');
    this.props.dispatch({
      type: USER_LOGOUT_REQUEST_SUCCESS,
      payload: {}
    });
    this.props.history.replace('/login');
  }
  async componentDidMount() {
    const storage = JSON.parse(await sessionStorage.getItem('user'));
    if (!storage) {
      this.props.history.push('login');
    }
    this.setState({ user: storage.user, token: storage.token });
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader
              onLogout={() => this.signOut()}
              email={this.state.user.email}
            />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <Suspense>
              <AppSidebarNav navConfig={navigation} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component
                            {...props}
                            extraProps={this.props.user.token}
                          />
                        )}
                      />
                    ) : null;
                  })}

                  <Redirect from="/home" to="/home/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user.user,
    userErr: state.user.userErr
  };
}
export default connect(mapStateToProps)(DefaultLayout);
