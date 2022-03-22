import React, { Component } from 'react';
// import { Card, CardBody, Col, Row } from "reactstrap";
import Table from '../../component/Table';
import { callWebService } from '../../api';
import { findIndex } from 'lodash';
class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      userBody: [],
      headers: ['Name', 'Email', 'Phone Number', 'Status', 'OTP', 'Action'],
      fields: {
        userId: { fullname: 1, contactNo: 1, email: 1, status: 1, otp: 1 }
      },
      filter: {},
      paginationArray: [],
      loading: null
    };
  }

  loading = () => (
    <div className='animated fadeIn pt-1 text-center'>Loading...</div>
  );
  componentDidMount() {
    let data = {
      filter: { deleted: false }
    };
    let headers = {
      'Content-type': 'application/json',
      Accept: 'application/json',
      authorization: `Bearer ${this.props.extraProps.accessToken}`
    };
    let options = {
      method: 'post',
      url: '/v1/daffo/Patient/count',
      data,
      headers
    };
    callWebService(options)
      .then(response => {
        this.getUserData();
        if (response.data.count > 20) {
          let indexLength =
            response.data.count % 20
              ? response.data.count / 20 + 1
              : response.data.count / 20;
          for (let index = 1; index < indexLength; index++) {
            this.state.paginationArray.push(index);
          }
        }
        this.setState({ count: response.data.count });
      })
      .catch(error => {
        console.log('count error', error);
      });
  }
  onChangeCount = page => {
    this.getUserData(page);
  };
  getUserData = (page = 1) => {
    let data = {
      filter: { deleted: false },
      fields: this.state.fields,
      perPage: 20,
      page
    };
    let headers = {
      'Content-type': 'application/json',
      Accept: 'application/json',
      authorization: `Bearer ${this.props.extraProps.accessToken}`
    };
    let options = {
      method: 'post',
      url: 'v1/daffo/Patient/get',
      data,
      headers
    };
    callWebService(options)
      .then(response => {
        let { userBody = [] } = this.state;
        response.data.map(
          item => (userBody = [...userBody, { ...item.userId }])
        );

        this.setState({ userBody: [...userBody] });
      })
      .catch(error => {
        console.log(error);
      });
  };
  getHeaders = data => {
    const headers = Object.keys(data);
    return headers;
  };
  blockUser = (_id, status) => {
    let data = {
      filter: { _id },
      setter: { $set: { status: !status } }
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
        let { userBody = [] } = this.state;
        let index = findIndex(userBody, item => item._id === _id);
        if (index > -1) {
          userBody.splice(index, 1, response.data[0]);
          this.setState({ userBody: [...userBody] });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  deleted = _id => {
    let data = { _id };

    let headers = {
      'Content-type': 'application/json',
      Accept: 'application/json',
      authorization: `Bearer ${this.props.extraProps.accessToken}`
    };
    let options = {
      method: 'delete',
      url: 'v1/daffo/dispatch/deleted',
      data,
      headers
    };
    callWebService(options)
      .then(response => {
        let { userBody = [] } = this.state;
        let index = findIndex(userBody, item => item._id === _id);
        if (index > -1) {
          userBody.splice(index, 1);
          this.setState({ userBody: [...userBody] });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  render() {
    return (
      <div className='animated fadeIn'>
        <Table
          headers={this.state.headers}
          title='User'
          tableData={this.state.userBody}
          tableHeaders={[
            'fullname',
            'email',
            'contactNo',
            'status',
            'otp',
            'action'
          ]}
          formLink={item =>
            this.props.history.push({
              pathname: `/home/user/edit/?id=${item._id}`,
              state: item
            })
          }
          paginationArray={this.state.paginationArray}
          onChangeCount={page => this.onChangeCount(page)}
          block={(_id, status) => {
            this.blockUser(_id, status);
          }}
          delete={_id => {
            this.deleted(_id);
          }}
        />
      </div>
    );
  }
}

export default User;
