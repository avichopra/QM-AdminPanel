import { Component } from 'react';
import { isValidConfirmPassword, isValidPassword } from '../../../validation';
import { callWebService } from '../../../api';

export class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmPassword: '',
      password: '',
      error: {
        confrimPasword: '',
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
  onSubmit = () => {
    if (this.validState()) {
      const data = {
        email: JSON.parse(this.props.match.params.id).email,
        password: this.state.password,
        resetPasswordToken: JSON.parse(this.props.match.params.id)
          .resetPasswordToken
      };
      let headers = {
        'content-type': 'application/json',
        Accept: 'application/json'
      };
      let options = {
        method: 'post',
        url: 'v1/auth/resetPassword',
        data,
        headers
      };
      callWebService(options)
        .then(response => {
          this.props.history.push('/login');
        })
        .catch(error => {
          console.log('error in the repsonse', error.response);
        });
    }
  };
  validState = () => {
    let validConfirmPassword = isValidConfirmPassword(
      this.state.password.trim(),
      this.state.confirmPassword.trim()
    );
    let validPassword = isValidPassword(this.state.password.trim());
    if (!validPassword.valid) {
      this.setState({
        error: { ...this.state.error, password: validPassword.message }
      });
      return false;
    }
    if (!validConfirmPassword.valid) {
      this.setState({
        error: {
          ...this.state.error,
          confrimPasword: validConfirmPassword.message
        }
      });
      return false;
    }
    return true;
  };
}

export default ResetPassword;
