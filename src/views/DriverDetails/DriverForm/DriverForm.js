import React, { Component } from 'react';
import Form from '../../../component/Form';
import {
  isValidEmail,
  isValidConfirmPassword,
  isValidPhoneNumber,
  isValidField,
  isValidPassword
} from '../../../validation';
import { callWebService } from '../../../api';

export class DriverForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      contactNo: '',
      email: '',
      password: '',
      confirmPassword: '',

      valid: {
        firstname: false,
        lastname: false,
        contactNo: false,
        email: false,
        password: false,
        confirmPassword: false
      },
      invalid: {
        firstname: false,
        lastname: false,
        contactNo: false,
        email: false,
        password: false,
        confirmPassword: false
      },
      error: {
        firstname: '',
        lastname: '',
        contactNo: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    };
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
  onSubmit = () => {
    // let user = JSON.parse(await sessionStorage.getItem("user"));
    if (this.validationState() && this.props.extraProps) {
      let headers = {
        'Content-type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${this.props.extraProps.accessToken}`
      };
      let data = {
        fullname: `${this.state.firstname} ${this.state.lastname}`,
        email: this.state.email,
        contactNo: this.state.contactNo,
        password: this.state.password
      };
      console.log("data",data)
      let options = {
        method: 'post',
        url: '/v1/daffo/User/create',
        data,
        headers
      };
      callWebService(options)
        .then(response => {
          this.props.history.push('/home/driver');
        })
        .catch(error => {
          this.setState({
            error: {
              ...this.state.error,
              email: 'Email already exists.'
            },
            invalid: {
              ...this.state.invalid,
              email: true
            },
            valid: {
              ...this.state.valid,
              email: false
            }
          });
          console.log('error', error.response.data);
        });
    }
  };
  validationState = () => {
    const { error = {}, valid = {}, invalid = {} } = this.state;
    const validEmail = isValidEmail(this.state.email.trim());
    const validFirstname = isValidField(this.state.firstname.trim());
    const validConfirmPassword = isValidConfirmPassword(
      this.state.password.trim(),
      this.state.confirmPassword.trim()
    );
    const validPassword = isValidPassword(this.state.password.trim());
    const validLastname = isValidField(this.state.lastname.trim());
    const validcontactNo = isValidPhoneNumber(this.state.contactNo.trim());
    if (!validFirstname.valid) {
      this.setState({
        error: {
          ...error,
          firstname: validFirstname.message.replace('{{Field}}', 'First name')
        },
        invalid: { ...invalid, firstname: true },
        valid: { ...valid, firstname: false }
      });

      return false;
    }
    if (!validLastname.valid) {
      this.setState({
        error: {
          ...error,
          lastname: validLastname.message.replace('{{Field}}', 'Last name'),
          firstname: ''
        },
        invalid: { ...invalid, lastname: true, firstname: false },
        valid: { ...valid, lastname: false, firstname: true }
      });
      return false;
    }
    if (!validcontactNo.valid) {
      this.setState({
        error: {
          ...error,
          contactNo: validcontactNo.message,
          lastname: ''
        },
        invalid: {
          ...invalid,
          contactNo: true,
          lastname: false
        },
        valid: { ...valid, contactNo: false, lastname: true }
      });
      return false;
    }
    if (!validEmail.valid) {
      this.setState({
        error: {
          ...error,
          email: validEmail.message,
          contactNo: ''
        },
        invalid: {
          ...invalid,
          email: true,
          contactNo: false
        },
        valid: {
          ...valid,
          email: false,
          contactNo: true
        }
      });
      return false;
    }
    if (!validPassword.valid) {
      this.setState({
        error: {
          ...error,
          password: validPassword.message,
          email: ''
        },
        invalid: { ...invalid, password: true, email: false },
        valid: { ...valid, password: false, email: true }
      });
      return false;
    } else if (!validConfirmPassword.valid) {
      this.setState({
        error: {
          ...error,
          confirmPassword: validConfirmPassword.message,
          password: ''
        },
        invalid: { ...invalid, confirmPassword: true, password: false },
        valid: { ...valid, confirmPassword: false, password: true }
      });

      return false;
    }
    this.setState({
      error: {
        ...error,
        confirmPassword: ''
      },
      invalid: {
        confirmPassword: false,
        firstname: false,
        lastname: false,
        email: false,
        password: false,
        contactNo: false
      },
      valid: {
        confirmPassword: true,
        firstname: true,
        lastname: true,
        email: true,
        password: true,
        contactNo: true
      }
    });

    return true;
  };

  render() {
    return (
      <div>
        <Form
          inputFields={[
            {
              name: 'firstname',
              type: 'text',
              value: this.state.firstname,
              placeholder: 'Enter the first name',
              id: 'firstname',
              valid: this.state.valid.firstname,
              label: 'First Name',
              invalid: this.state.invalid.firstname,
              formFeedback: this.state.error.firstname
            },
            {
              name: 'lastname',
              type: 'text',
              value: this.state.lastname,
              placeholder: 'Enter the last name',
              id: 'lastname',
              valid: this.state.valid.lastname,
              label: 'Last Name',
              invalid: this.state.invalid.lastname,
              formFeedback: this.state.error.lastname
            },
            {
              name: 'contactNo',
              type: 'text',
              value: this.state.contactNo,
              placeholder: 'Enter the phone number',
              id: 'contactNo',
              valid: this.state.valid.contactNo,
              label: 'Phone Number',
              invalid: this.state.invalid.contactNo,
              formFeedback: this.state.error.contactNo
            },
            {
              name: 'email',
              type: 'text',
              value: this.state.email,
              placeholder: 'Enter the email',
              id: 'email',
              valid: this.state.valid.email,
              label: 'Email',
              invalid: this.state.invalid.email,
              formFeedback: this.state.error.email
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
              placeholder: 'Enter the confirm password',
              id: 'confirmPassword',
              valid: this.state.valid.confirmPassword,
              label: 'Confirm Password',
              invalid: this.state.invalid.confirmPassword,
              formFeedback: this.state.error.confirmPassword
            }
          ]}
          title={'Add Driver'}
          onClick={this.onSubmit}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default DriverForm;
