import { Component } from 'react';
import { isValidEmail, isValidPassword } from '../../../validation';

import { login } from '../../../redux/actions/user';

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: {
        email: '',
        password: ''
      }
    };
  }
  handleChange = event => {
    let target = event.target;
    let name = target.name;
    let value = target.value;

    this.setState({
      [name]: value,
      error: { ...this.state.error, [name]: '' }
    });
  };
  async componentWillReceiveProps(nextProps) {
    console.log("error in component will receive prope",nextProps)
    const { user = {}, userErr = {} } = nextProps;
    console.log("user",user)
    if (user) {
      await sessionStorage.setItem('user', JSON.stringify(user));
      console.log("Props history>>>>>>>>>>>>>>>>>>>>>",this.props.history)
      nextProps.history.push('/home');
    } else if (userErr) {
      if (userErr.message === 'Incorrect password') {
        this.setState({
          error: { ...this.state.error, password: userErr.message }
        });
      } else if (userErr.message === 'UNAUTHORISED CALL') {
        this.setState({
          error: { ...this.state.error, email: 'You are not authorised user.' }
        });
      } else {
        console.log("Error in login",userErr.message)
        this.setState({
          error: { ...this.state.error, email: userErr.message }
        });
      }
    }
  }

  onSubmit = () => {
    if (this.validState()) {
      const data = {
        email: this.state.email,
        password: this.state.password,
        role: 'Admin'
      };
      this.props.dispatch(login(data));
    }
  };
  validState = () => {
    let validEmail = isValidEmail(this.state.email.trim());
    let validPassword = isValidPassword(this.state.password.trim());

    if (!validEmail.valid) {
      this.setState({
        error: { ...this.state.error, email: validEmail.message }
      });
      return false;
    }
    if (!validPassword.valid) {
      this.setState({
        error: { ...this.state.error, password: validPassword.message }
      });
      return false;
    }
    return true;
  };
}

export default Login;
