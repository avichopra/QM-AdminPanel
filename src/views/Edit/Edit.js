import React, { Component } from 'react';
import Form from '../../component/Form';
import { isValidEmail, isValidPhoneNumber, isValidField } from '../../validation';
import { callWebService } from '../../api';
export default class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: props.location.state._id,
      fullname: props.location.state.fullname,
      email: props.location.state.email,
      contactNo: props.location.state.contactNo,
      error: {
        fullname: '',
        email: '',
        contactNo: ''
      },
      invalid: {
        fullname: false,
        email: false,
        contactNo: false
      },
      valid: {
        fullname: false,
        email: false,
        contactNo: false
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

  validationState = () => {
    const { error = {}, valid = {}, invalid = {} } = this.state;
    const validEmail = isValidEmail(this.state.email.trim());
    const validFullname = isValidField(this.state.fullname.trim());
    const validcontactNo = isValidPhoneNumber(this.state.contactNo.trim());
    if (!validFullname.valid) {
      this.setState({
        error: {
          ...error,
          firstname: validFullname.message.replace('{{Field}}', 'Full name')
        },
        invalid: { ...invalid, fullname: true },
        valid: { ...valid, fullname: false }
      });

      return false;
    }

    if (!validcontactNo.valid) {
      this.setState({
        error: {
          ...error,
          contactNo: validcontactNo.message,
          fullname: ''
        },
        invalid: {
          ...invalid,
          contactNo: true,
          fullname: false
        },
        valid: { ...valid, contactNo: false, fullname: true }
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

    this.setState({
      error: {
        ...error,
        email: ''
      },
      invalid: {
        fullname: false,
        email: false,
        contactNo: false
      },
      valid: {
        fullname: true,
        email: true,
        contactNo: true
      }
    });

    return true;
  };
  onSubmit = () => {
    if (this.validationState() && this.props.extraProps) {
      let data = {
        filter: { _id: this.state._id },
        setter: {
          $set: {
            fullname: this.state.fullname,
            email: this.state.email,
            contactNo: this.state.contactNo
          }
        }
      };
      let headers = {
        'Content-type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${this.props.extraProps.accessToken}`
      };
      let options = {
        method: 'patch',
        url: 'v1/daffo/User/update',
        data,
        headers
      };
      callWebService(options)
        .then(response => {
          this.props.history.push(`/home/${this.props.location.state.title.toLowerCase()}`);
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

  render() {
    return (
      <div>
        <Form
          inputFields={[
            {
              name: 'fullname',
              type: 'text',
              value: this.state.fullname,
              placeholder: 'Enter the  full name',
              id: 'fullname',
              valid: this.state.valid.fullname,
              label: 'Full Name',
              invalid: this.state.invalid.fullname,
              formFeedback: this.state.error.fullname
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
            }
          ]}
          title={`Edit ${this.props.location.state.title}`}
          onClick={this.onSubmit}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
