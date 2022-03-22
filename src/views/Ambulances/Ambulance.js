import React, { Component } from 'react';
import Table from '../../component/Table';
import { callWebService, callApi } from '../../api';
import { findIndex } from 'lodash';
export default class Ambulance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      headers: ['Vehicle Name', 'Driver Name', 'Hospital', 'Status', 'Action'],
      ambulanceBody: [],
      tableHeaders: [
        'ambulanceId.vehicleName',
        'driverId.userId.fullname',
        'ambulanceId.hospitalName',
        'status',
        'action'
      ],
      fields: {
        ambulanceId: {
          vehicleName: 1,
          hospitalName: 1
        },
        status: 1,
        driverId: {
          userId: {
            fullname: 1,
            email: 1
          }
        }
      },
      filter: {},
      paginationArray: []
    };
  }
  componentDidMount() {
    let data = {
      filter: {}
    };
    let headers = {
      'Content-type': 'application/json',
      Accept: 'application/json',
      authorization: `Bearer ${this.props.extraProps.accessToken}`
    };
    let options = {
      method: 'post',
      url: '/v1/daffo/AssignAmbulance/count',
      data,
      headers
    };
    callWebService(options)
      .then(response => {
        this.getUserData();
        if (response.data.count > 20) {
          let indexLength = response.data.count % 20 ? response.data.count / 20 + 1 : response.data.count / 20;
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
      filter: this.state.filter,
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
      url: '/v1/daffo/AssignAmbulance/get',
      data,
      headers
    };
    callWebService(options)
      .then(response => {
        console.log(response);
        this.setState({
          ambulanceBody: [...response.data]
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  blockAmbulance = (_id, status) => {
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
      url: 'v1/daffo/AssignAmbulance/update',
      data,
      headers
    };
    callWebService(options)
      .then(async response => {
        await callApi(
          'patch',
          'v1/daffo/Ambulance/update',
          {
            ...data,
            filter: { ...data.filter, _id: response.data[0].ambulanceId }
          },
          headers
        );

        let { ambulanceBody = [] } = this.state;
        let index = findIndex(ambulanceBody, item => item._id === _id);
        if (index > -1) {
          ambulanceBody[index] = {
            ...ambulanceBody[index],
            status: response.data[0].status
          };

          this.setState({ ambulanceBody: [...ambulanceBody] });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  deleteAmbulance = _id => {
    let data = {
      filter: { _id },
      setter: {
        $set: {
          deleted: true
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
      url: 'v1/daffo/AssignAmbulance/update',
      data,
      headers
    };
    callWebService(options)
      .then(response => {
        console.log('repsose', response);
        // let { ambulanceBody = [] } = this.state;
        // let index = findIndex(ambulanceBody, item => item._id === _id);
        // if (index > -1) {
        //   ambulanceBody.splice(index, 1);
        //   this.setState({ ambulanceBody: [...ambulanceBody] });
        // }
      })
      .catch(error => {
        console.log(error);
      });
  };
  getHeaders = data => {
    const headers = Object.keys(data);
    return headers;
  };
  render() {
    return (
      <div className="animated fadeIn">
        <Table
          headers={this.state.headers}
          title="Ambulance"
          tableData={this.state.ambulanceBody}
          tableHeaders={this.state.tableHeaders}
          addIcon={true}
          addLink={() => this.props.history.push('/home/ambulance/add')}
          formLink={item =>
            this.props.history.push({
              pathname: `/home/ambulance/edit/?id=${item._id}`,
              state: item
            })
          }
          paginationArray={this.state.paginationArray}
          onChangeCount={page => this.onChangeCount(page)}
          block={(_id, status) => {
            this.blockAmbulance(_id, status);
          }}
          delete={_id => {
            this.deleteAmbulance(_id);
          }}
        />
      </div>
    );
  }
}
