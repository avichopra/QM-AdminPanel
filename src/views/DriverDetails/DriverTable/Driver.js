import React, { Component } from 'react';
import { callWebService } from '../../../api';
import Table from '../../../component/Table';
import { findIndex } from 'lodash';
export class Driver extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      userBody: [],
      headers: ['Name', 'Email', 'Phone Number', 'Status', 'OTP', 'Action'],

      fields: {
        userId: {
          fullname: 1,
          email: 1,
          contactNo: 1,
          status: 1,
          otp: 1
        }
      },
      filter: {
        role: 'Driver'
      },
      paginationArray: []
    };
  }

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
      url: '/v1/daffo/Driver/count',
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
        this.setState({
          count: response.data.count,
          paginationArray: [...this.state.paginationArray]
        });
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
      fields: { ...this.state.fields },
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
      url: '/v1/daffo/Driver/get',
      data,
      headers
    };
    callWebService(options)
      .then(response => {
        console.log('Driver Details', response);
        let { userBody = [] } = this.state;
        response.data.map(
          item => (userBody = userBody.concat({ ...item.userId }))
        );
        this.setState({ userBody: [...userBody] });
      })
      .catch(error => {
        console.log(error);
      });
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
  deleteDriver = _id => {
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
          title='Driver'
          tableData={this.state.userBody}
          tableHeaders={[
            'fullname',
            'email',
            'contactNo',
            'status',
            'otp',
            'action'
          ]}
          addIcon={true}
          addLink={() => this.props.history.push('/home/driver/add')}
          formLink={item =>
            this.props.history.push({
              pathname: `/home/driver/edit/?id=${item._id}`,
              state: item
            })
          }
          paginationArray={this.state.paginationArray}
          onChangeCount={page => this.onChangeCount(page)}
          block={(_id, status) => {
            this.blockUser(_id, status);
          }}
          delete={_id => {
            this.deleteDriver(_id);
          }}
          detailPage={_id =>
            this.props.history.push({
              pathname: `/home/driver/detail/?id=${_id}`,
              state: { _id }
            })
          }
        />
      </div>
    );
  }
}
export default Driver;
