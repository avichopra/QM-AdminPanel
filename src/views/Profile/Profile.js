import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import Form from '../../component/Form';
import {
  isValidPassword,
  isValidField,
  isValidConfirmPassword
} from '../../validation';
import { callWebService } from '../../api';
import { getReduxKey } from '../../redux';
import { get } from 'lodash';
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: '',
      fullname: '',
      password: '',
      currentPassword: '',
      confirmPassword: '',
      invalid: {
        password: false,
        currentPassword: false,
        confirmPassword: false
      },
      valid: {
        password: false,
        currentPassword: false,
        confirmPassword: false
      },
      error: {
        password: '',
        currentPassword: '',
        confirmPassword: ''
      }
    };
  }
  componentDidMount() {
    let reduxData = getReduxKey('user');
    let user = get(reduxData, 'user.user.user', {});
    this.setState({ fullname: user.fullname, _id: user._id });
  }
  handleChange = event => {
    let target = event.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
      error: {
        ...this.state.error,
        [name]: ''
      },
      invalid: { ...this.state.invalid, [name]: false }
    });
  };
  submit = () => {
    let headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      authorization: `Bearer ${this.props.extraProps.accessToken}`
    };
    if (this.state.fullname.trim()) {
      let data = {
        filter: {
          role: 'Admin',
          _id: this.state._id
        },
        setter: {
          $set: {
            fullname: this.state.fullname
          }
        }
      };
      let options = {
        method: 'patch',
        url: '/v1/daffo/User/update',
        data,
        headers
      };
      callWebService(options)
        .then(response => {})
        .catch(error => console.log('errror', error.response));
    }
    if (this.state.password.trim() && this.checkValidation()) {
      let data = {
        password: this.state.currentPassword,
        newPassword: this.state.password
      };

      let options = {
        method: 'post',
        url: '/v1/auth/changePassword',
        data,
        headers
      };
      callWebService(options)
        .then(response => {
          if (response.data) {
            return (
              <Alert color='success'>{'Password is change successfully'}</Alert>
            );
          } else {
            this.setState({
              error: {
                ...this.state.error,
                currentPassword: 'Current password could not be matched'
              },
              invalid: { ...this.state.invalid, currentPassword: true },
              valid: { ...this.state.valid, currentPassword: false }
            });
          }
        })
        .catch(error => {
          console.log('error', error.response.data);
        });
    }
  };

  checkValidation = () => {
    const {
      currentPassword = '',
      password = '',
      confirmPassword = ''
    } = this.state;
    const validCurrentPassword = isValidField(currentPassword.trim());
    const validPassword = isValidPassword(password);
    const validConfirmPassword = isValidConfirmPassword(
      password.trim(),
      confirmPassword.trim()
    );
    if (password.trim()) {
      if (!validCurrentPassword.valid) {
        this.setState({
          error: {
            ...this.state.error,
            currentPassword: validCurrentPassword.message.replace(
              '{{Field}}',
              'Current password'
            )
          },
          invalid: { ...this.state.invalid, currentPassword: true },
          valid: { ...this.state.valid, currentPassword: false }
        });
        return false;
      } else if (!validPassword.valid) {
        this.setState({
          error: {
            ...this.state.error,
            password: validPassword.message,
            fullname: ''
          },
          invalid: { ...this.state.invalid, password: true },
          valid: { ...this.state.valid, password: false }
        });
        return false;
      } else if (!validConfirmPassword.valid) {
        this.setState({
          error: {
            ...this.state.error,
            confirmPassword: validConfirmPassword.message,
            password: ''
          },
          invalid: {
            ...this.state.invalid,
            confirmPassword: true,
            password: false
          },
          valid: { ...this.state.valid, confirmPassword: false, password: true }
        });

        return false;
      } else {
        this.setState({
          error: {
            ...this.state.error,
            currentPassword: '',
            password: '',
            confirmPassword: ''
          },
          invalid: {
            ...this.state.invalid,
            currentPassword: false,
            password: false,
            confirmPassword: false
          },
          valid: {
            ...this.state.valid,
            password: true,
            currentPassword: true,
            confirmPassword: true
          }
        });
      }
      return true;
    }
  };
  render() {
    return (
      <div>
        <Form
          title='My Profile'
          inputFields={[
            {
              name: 'fullname',
              type: 'text',
              value: this.state.fullname,
              placeholder: 'Enter the fullname',
              id: 'fullname',
              valid: false,
              label: 'Full Name',
              invalid: false,
              formFeedback: ''
            },
            {
              name: 'currentPassword',
              type: 'password',
              value: this.state.currentPassword,
              placeholder: 'Enter the current password',
              id: 'currentPassword',
              valid: this.state.valid.currentPassword,
              label: 'Current Password',
              invalid: this.state.invalid.currentPassword,
              formFeedback: this.state.error.currentPassword
            },
            {
              name: 'password',
              type: 'password',
              value: this.state.password,
              placeholder: 'Enter the password',
              id: 'password',
              valid: this.state.valid.password,
              label: 'Password',
              invalid: this.state.invalid.password,
              formFeedback: this.state.error.password
            },
            {
              name: 'confirmPassword',
              type: 'password',
              value: this.state.confirmPassword,
              placeholder: 'Enter the confirmPassword',
              id: 'confirmPassword',
              valid: this.state.valid.confirmPassword,
              label: 'Confirm Password',
              invalid: this.state.invalid.confirmPassword,
              formFeedback: this.state.error.confirmPassword
            }
          ]}
          onChange={this.handleChange}
          onClick={this.submit}
        />
      </div>
    );
  }
}
