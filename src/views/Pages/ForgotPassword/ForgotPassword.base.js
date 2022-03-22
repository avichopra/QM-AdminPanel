import { Component } from 'react';
import { callWebService } from '../../../api';
import { isValidEmail } from '../../../validation';

export class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      error: {
        email: ''
      }
    };
  }
  handleChange = event => {
    let target = event.target;
    let name = target.name;
    let value = target.value;

    this.setState({ [name]: value, error: { ...this.state.error, email: '' } });
  };
  validState = () => {
    let validEmail = isValidEmail(this.state.email.trim());
    if (!validEmail.valid) {
      this.setState({
        error: { ...this.state.error, email: validEmail.message }
      });
    }
    return validEmail.valid;
  };
  onSubmit = () => {
    if (this.validState()) {
      const data = {
        email: this.state.email,
        role: 'Admin'
      };
      const headers = {
        'content-type': 'application/json',
        Accept: 'application/json'
      };
      let options = {
        method: 'post',
        url: 'v1/auth/forget',
        data,
        headers
      };
      callWebService(options)
        .then(response => {
          this.props.history.push('/login');
        })
        .catch(error => {
          if (error.response.data.message === 'Unauthorised Call') {
            this.setState({
              error: {
                ...this.state.error,
                email: 'You are not authorised user.'
              }
            });
          } else {
            this.setState({
              error: { ...this.state.error, email: error.response.data.message }
            });
          }
        });
    }
  };
}

export default ForgotPassword;
