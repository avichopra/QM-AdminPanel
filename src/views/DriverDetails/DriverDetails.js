import React, { Component } from 'react';
import {
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';
import { get } from 'lodash';
import { callWebService } from '../../api';
import classnames from 'classnames';
import moment from 'moment';
import ListingTrips from '../../component/ListingTrips';
import Table from '../../component/Table';

export class DriverDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        driverId: {
          userId: {
            fullname: 1,
            email: 1,
            status: 1,
            createdAt: 1
          }
        },
        ambulanceId: 1
      },
      ambulanceId: null,
      driverId: null,
      activeTab: '1',
      nestedActiveTab: '3',
      successFullTrips: [],
      cancelTrips: [],
      successFullCount: 0,
      cancelCount: 0,
      paginationArraySuccefulTrip: [],
      paginationArrayCancelTrip: [],
      successFullTripsTableHeaders: [
        'patientId.userId.fullname',
        'patientId.userId.email',
        'patientAddress'
      ],
      cancelTripsTableHeaders: [
        'patientId.userId.fullname',
        'patientId.userId.email',
        'cancelledBy',
        'cancellationMessage',
        'patientAddress'
      ],
      successFullTripsHeaders: [
        'Patient Name',
        'Patient Email',
        'Patient Address'
      ],
      cancelTripsHeaders: [
        'Patient Name',
        'Patient Email',
        'Cancelled By',
        'Cancellation Message',
        'Patient Address'
      ]
    };
  }
  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };
  toggleNested = tab => {
    if (this.state.nestedActiveTab !== tab) {
      this.setState({
        nestedActiveTab: tab
      });
    }
  };
  componentDidMount() {
    let _id = get(this.props, 'location.state._id', '');
    let data = {
      filter: {
        driverId: _id
      },
      fields: this.state.fields,
      perPage: 1
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
        if (response.data && response.data[0]) {
          let data = response.data[0];
          this.setState({
            driverId: data.driverId,
            ambulanceId: data.ambulanceId
          });
        } else {
          data = {
            perPage: 1,
            filter: { _id },
            fields: this.state.fields.driverId
          };
          callWebService({ ...options, url: '/v1/daffo/Driver/get', data })
            .then(result => {
              console.log('result', result.data[0]);
              this.setState({
                driverId: {
                  ...this.state.fields.driverId,
                  userId: result.data[0].userId
                }
              });
            })
            .catch(error => console.log('error----->', error.response));
        }
      })
      .catch(error => {
        console.log(' error', error.response);
      });
    data = {
      filter: {
        driverId: _id,
        status: 'Complete'
      }
    };
    callWebService({ ...options, url: '/v1/daffo/Trips/Count', data })
      .then(response => {
        this.getSuccessfulData();
        if (response.data.count > 20) {
          let indexLength =
            response.data.count % 20
              ? response.data.count / 20 + 1
              : response.data.count / 20;
          for (let index = 1; index < indexLength; index++) {
            this.state.paginationArraySuccefulTrip.push(index);
          }
        }
        this.setState({ successFullCount: response.data.count });
      })
      .catch(error => {
        console.log('error=>', error);
      });
    data = {
      filter: {
        driverId: _id,
        status: 'Cancelled'
      }
    };
    callWebService({ ...options, url: '/v1/daffo/Trips/Count', data })
      .then(response => {
        this.getCancelData();
        if (response.data.count >= 0) {
          let indexLength =
            response.data.count % 20
              ? response.data.count / 20 + 1
              : response.data.count / 20;
          for (let index = 1; index < indexLength; index++) {
            this.state.paginationArrayCancelTrip.push(index);
          }
        }
        this.setState({ cancelCount: response.data.count });
      })
      .catch(error => {
        console.log('error=>', error);
      });
  }
  getSuccessfulData = (page = 1) => {
    let _id = get(this.props, 'location.state._id', '');
    let data = {
      filter: {
        driverId: _id,
        status: 'Complete'
      },
      page,
      perPage: 20,
      fields: {
        patientId: { userId: { fullname: 1, email: 1 } },
        patientAddress: 1
      }
    };
    let headers = {
      'Content-type': 'application/json',
      Accept: 'application/json',
      authorization: `Bearer ${this.props.extraProps.accessToken}`
    };
    let options = {
      method: 'post',
      url: '/v1/daffo/Trips/get',
      data,
      headers
    };
    callWebService(options)
      .then(response => {
        console.log('response.data', response.data);
        this.setState({ successFullTrips: [...response.data] });
      })
      .catch(error => {
        console.log('errror', error.response);
      });
  };
  getCancelData = (page = 1) => {
    let _id = get(this.props, 'location.state._id', '');
    let data = {
      filter: {
        driverId: _id,
        status: 'Cancelled'
      },
      page,
      perPage: 20,
      fields: {
        patientId: { userId: { fullname: 1, email: 1 } },
        driverId: { userId: { fullname: 1 } },
        patientAddress: 1,
        cancelledBy: 1,
        cancellationMessage: 1
      }
    };
    let headers = {
      'Content-type': 'application/json',
      Accept: 'application/json',
      authorization: `Bearer ${this.props.extraProps.accessToken}`
    };
    let options = {
      method: 'post',
      url: '/v1/daffo/Trips/get',
      data,
      headers
    };
    callWebService(options)
      .then(response => {
        console.log('response data', response.data);
        let cancelTrips = [];
        response.data.map(item => {
          cancelTrips = [
            ...cancelTrips,
            {
              ...item,
              cancelledBy:
                item.cancelledBy == item.patientId._id
                  ? item.patientId.userId.fullname
                  : item.driverId.userId.fullname
            }
          ];
        });
        this.setState({ cancelTrips: [...cancelTrips] });
        console.log('cancelTrip', cancelTrips);
      })
      .catch(error => {
        console.log('errror', error.response);
      });
  };
  render() {
    const { driverId = null, ambulanceId = null } = this.state;
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1');
              }}
            >
              Driver Details
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => {
                this.toggle('2');
              }}
            >
              Trips
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId='1'>
            <Row>
              <Col>
                {[
                  {
                    label: 'Name',
                    value: driverId && driverId.userId.fullname
                  },
                  {
                    label: 'Email',
                    value: driverId && driverId.userId.email
                  },
                  {
                    label: 'Status',
                    value: driverId && driverId.userId.status
                  },
                  {
                    label: ' Registeration Date',
                    value:
                      driverId &&
                      moment(driverId.userId.createdAt).format('MM-DD-YYYY')
                  },
                  {
                    label: 'Vehicle Support Type',
                    value: ambulanceId ? ambulanceId.vehicleSupportType : '-'
                  },
                  {
                    label: 'Vehicle Name',
                    value: ambulanceId ? ambulanceId.vehicleName : '-'
                  },
                  {
                    label: 'Vehicle Number',
                    value: ambulanceId ? ambulanceId.vehicleNo : '-'
                  },
                  {
                    label: 'Vehicle Model',
                    value: ambulanceId ? ambulanceId.vehicleModel : '-'
                  },
                  {
                    label: 'Year',
                    value: ambulanceId ? ambulanceId.year : '-'
                  },
                  {
                    label: 'License Plate',
                    value: ambulanceId ? ambulanceId.licensePlate : '-'
                  },
                  {
                    label: 'Hospital Name',
                    value: ambulanceId ? ambulanceId.hospitalName : '-'
                  },
                  {
                    label: 'Hospital Address',
                    value: ambulanceId ? ambulanceId.hospitalAddress : '-'
                  }
                ].map((item, index) => {
                  return (
                    <Row
                      style={{ paddingTop: 9, paddingBottom: 9 }}
                      key={index}
                    >
                      <Col sm='2'>{`${item.label}`}</Col>
                      <Col sm='10'>{`${item.value}`}</Col>
                    </Row>
                  );
                })}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId='2'>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.nestedActiveTab === '3'
                  })}
                  onClick={() => {
                    this.toggleNested('3');
                  }}
                >
                  Successfull Trips
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.nestedActiveTab === '4'
                  })}
                  onClick={() => {
                    this.toggleNested('4');
                  }}
                >
                  Cancel Trips
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.nestedActiveTab}>
              <TabPane tabId='3'>
                <Table
                  headers={this.state.successFullTripsHeaders}
                  tableData={this.state.successFullTrips}
                  tableHeaders={this.state.successFullTripsTableHeaders}
                  addIcon={false}
                  paginationArray={this.state.paginationArraySuccefulTrip}
                  onChangeCount={page => this.getSuccessfulData(page)}
                />
              </TabPane>
              <TabPane tabId='4'>
                <Table
                  headers={this.state.cancelTripsHeaders}
                  tableData={this.state.cancelTrips}
                  tableHeaders={this.state.cancelTripsTableHeaders}
                  paginationArray={this.state.paginationArrayCancelTrip}
                  onChangeCount={page => this.getCancelData(page)}
                />
              </TabPane>
            </TabContent>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default DriverDetails;
