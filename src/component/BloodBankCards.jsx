import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ListGroupItemHeading,
  ListGroupItemText,
  Label,
  Input,
  Button
} from 'reactstrap';
import 'font-awesome/css/font-awesome.min.css';
import { callWebService } from '../api';

export default class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bloodBankName: 1,
      bloodBankNo: 1,
      bloodBankAddress: 1
      //   year: '',
      //   licensePlate: '',
      //   hospitalName: '',
      //   hospitalAddress: '',
      //   hospitalNo: '',
      //   driver: [],
      //   email: '',
      //   userId: '',
      //   dropdownOpen: true,
      //   deviceId: '',
      //   oldDriverEmail: '',
      //   vehicleSupportType: '',
      //   oldDriverId: ''
    };
  }
  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };
  onChange = event => {
    let target = event.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      dropdownOpen: true,
      userId: '',
      [name]: value,
      error: {
        ...this.state.error,
        [name]: ''
      },
      invalid: { ...this.state.invalid, [name]: false }
    });
    if (name === 'email' && this.state.email.length > 2) {
      this.getDriverApi(value);
    }
  };
  getDriverApi(value) {
    let data = {
      perPage: 10,
      filter: {
        email: { $regex: value },
        role: 'Driver',
        deleted: false,
        status: true
      },
      fields: {
        fullname: 1,
        email: 1
      }
    };
    let headers = {
      'Content-type': 'application/json',
      Accept: 'application/json',
      authorization: `Bearer ${this.props.extraProps.accessToken}`
    };
    let options = {
      method: 'post',
      url: '/v1/daffo/User/get',
      data,
      headers
    };
    callWebService(options)
      .then(response => {
        this.setState({ driver: [...response.data] });
      })
      .catch(error => {
        console.log('error', error.response.data);
      });
  }
  componentDidMount() {
    console.log('>>>>props>>', this.props);
    const { state = {} } = this.props.location;
    const { _id = '' } = state._id;
    // if (state.driverId) {
    //   const { email = '' } = state.driverId && state.driverId.userId;

    //   this.setState({
    //     email,
    //     userId: state.driverId.userId._id,
    //     oldDriverId: state.driverId.userId._id,
    //     oldDriverEmail: email,
    //     dropdownOpen: false
    //   });
    // }
    let data = {
      fields: {},
      filter: { _id },
      perPage: 1
    };
    let headers = {
      'Content-type': 'application/json',
      Accept: 'application/json',
      authorization: `Bearer ${this.props.extraProps.accessToken}`
    };
    let options = {
      method: 'post',
      url: '/v1/daffo/BloodBank/get',
      data,
      headers
    };
    callWebService(options)
      .then(response => {
        let {
          bloodBankName = '',
          bloodBankNo = '',
          bloodBankAddress = ''
          //   year = '',
          //   licensePlate = '',
          //   hospitalName = '',
          //   hospitalAddress = '',
          //   hospitalNo = '',
          //   deviceId = '',
          //   vehicleSupportType
        } = response.data[0];
        this.setState({
          bloodBankName,
          bloodBankNo,
          bloodBankAddress
          //   year,
          //   licensePlate,
          //   hospitalName,
          //   hospitalAddress,
          //   hospitalNo,
          //   deviceId,
          //   vehicleSupportType
        });
      })
      .catch(error => {
        console.log('errror', error.resposne);
      });
  }

  onSubmit = () => {
    let headers = {
      'Content-type': 'application/json',
      Accept: 'application/json',
      authorization: `Bearer ${this.props.extraProps.accessToken}`
    };

    let data = {
      ambulanceId: this.props.location.state.ambulanceId._id,
      driverId: this.state.userId ? this.state.userId : '',
      oldDriverId: this.state.oldDriverId
    };
    let options = {
      method: 'patch',
      url: '/v1/daffo/dispatch/driverAssign',
      data,
      headers
    };
    callWebService(options)
      .then(resp => {
        console.log('resp', resp.data);
        this.props.history.push('/home/ambulance');
        // if (this.state.email !== this.state.oldDriverEmail) {
        //   data = {
        //     filter: { email: this.state.oldDriverEmail },
        //     setter: {
        //       $unset: {
        //         deviceId: ''
        //       }
        //     }
        //   };
        //   options = {
        //     method: 'patch',
        //     url: '/v1/daffo/User/update',
        //     data,
        //     headers
        //   };
        //   callWebService({ ...options, url: '/v1/daffo/User/update', data })
        //     .then(resp => {
        //       console.log('------- resp ---->', resp);
        //       !this.state.userId &&
        //         this.props.history.push({
        //           pathname: `/home/ambulance/`
        //         });
        //     })
        //     .catch(error => {
        //       console.log('------------', error.response);
        //     });
        // }
        // if (this.state.userId) {
        //   data = {
        //     filter: { _id: this.state.userId },
        //     setter: {
        //       $set: {
        //         deviceId: this.state.deviceId
        //       }
        //     }
        //   };
        //   callWebService({ ...options, url: '/v1/daffo/User/update', data })
        //     .then(resp => {
        //       this.props.history.push({
        //         pathname: `/home/ambulance/`
        //       });
        //     })
        //     .catch(error => {
        //       console.log('------------', error.response);
        //     });
        // }
      })
      .catch(error => {
        console.log('------------', error.response);
      });
  };
  render() {
    let {
      bloodBankName = '',
      bloodBankNo = '',
      bloodBankAddress = ''
      //   year = '',
      //   licensePlate = '',
      //   hospitalAddress = '',
      //   hospitalName = '',
      //   hospitalNo = '',
      //   deviceId = '',
      //   vehicleSupportType
    } = this.state;
    return (
      <div>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" /> {'Detail Blood Bank'}
              </CardHeader>
              <CardBody>
                {/* <Row>
                  <Col sm='2'>Ambulance Type</Col>
                  <Col sm='10'>{vehicleSupportType ? 'Advance' : 'Basic'}</Col>
                </Row> */}
                {/* {[
                  { label: 'Vehicle SupportType', value: vehicleSupportType },
                  { label: 'Vehicle Name', value: vehicleName },
                  { label: 'Vehicle Number', value: vehicleNo },
                  { label: 'Vehicle Model', value: vehicleModel },
                  { label: 'Year', value: year },
                  { label: 'License Plate', value: licensePlate },
                  { label: 'Hospital Name', value: hospitalName },
                  {
                    label: 'Hospital Address',
                    value: hospitalAddress
                  },
                  {
                    label: 'Hospital Number',
                    value: hospitalNo
                  },
                  {
                    label: 'Device ID',
                    value: deviceId
                  }
                ].map((item, index) => {
                  return (
                    <Row style={{ paddingTop: 9, paddingBottom: 9 }} key={index}>
                      <Col sm="2">{`${item.label}`}</Col>
                      <Col sm="10">{`${item.value}`}</Col>
                    </Row>
                  );
                })} */}
                <Row sm="10" style={{ marginTop: 10 }}>
                  <Col sm="2">
                    <Label>Name</Label>
                  </Col>
                  <Col sm="10">
                    <Input
                      type={'text'}
                      name={'email'}
                      id={'email'}
                      placeholder={'Enter the driver email'}
                      value={this.state.email}
                      onChange={event => this.onChange(event)}
                    />

                    {/* <Dropdown
                      isOpen={this.state.dropdownOpen && this.state.email.length > 2}
                      toggle={() => {
                        return this.state.dropdownOpen && this.state.email.length > 2;
                      }}
                      direction="left"
                    >
                      <DropdownToggle color="#ffff" />
                      <DropdownMenu>
                        {this.state.driver.map((item, index) => {
                          return (
                            <DropdownItem
                              key={index}
                              onClick={() => {
                                this.setState({
                                  userId: item._id,
                                  email: item.email,
                                  error: {
                                    ...this.state.error,
                                    userId: ''
                                  },
                                  invalid: {
                                    ...this.state.invalid,
                                    userId: false
                                  },
                                  dropdownOpen: false
                                });
                              }}
                            >
                              <ListGroupItemHeading>{item.fullname}</ListGroupItemHeading>

                              <ListGroupItemText>{item.email}</ListGroupItemText>
                            </DropdownItem>
                          );
                        })}
                      </DropdownMenu>
                    </Dropdown> */}
                  </Col>
                </Row>
                <Row sm="10" style={{ marginTop: 10 }}>
                  <Col sm="2">
                    <Label>Name</Label>
                  </Col>
                  <Col sm="10">
                    <Input
                      type={'text'}
                      name={'email'}
                      id={'email'}
                      placeholder={'Enter the driver email'}
                      value={this.state.email}
                      onChange={event => this.onChange(event)}
                    />
                  </Col>
                </Row>
                <Row sm="10" style={{ marginTop: 10 }}>
                  <Col sm="2">
                    <Label>Name</Label>
                  </Col>
                  <Col sm="10">
                    <Input
                      type={'text'}
                      name={'email'}
                      id={'email'}
                      placeholder={'Enter the driver email'}
                      value={this.state.email}
                      onChange={event => this.onChange(event)}
                    />
                  </Col>
                </Row>
                {/* <Row className="justify-content-center">
                  {[
                    {
                      name: 'Edit Ambulance Information',
                      onClick: () =>
                        this.props.history.push({
                          pathname: `/home/ambulance/detail/?id=${this.props.location.state.ambulanceId._id}`,
                          state: {
                            vehicleModel,
                            vehicleName,
                            vehicleNo,
                            year,
                            licensePlate,
                            hospitalName,
                            hospitalAddress,
                            hospitalNo,
                            edit: true,
                            deviceId,
                            vehicleSupportType,
                            _id: this.props.location.state.ambulanceId._id
                          }
                        })
                    },
                    { name: 'Submit', onClick: () => this.onSubmit() }
                  ].map((item, index) => {
                    return (
                      <Col xs="4" key={index}>
                        <Button size="lg" color={'success'} outline onClick={item.onClick} block>
                          {item.name}
                        </Button>
                      </Col>
                    );
                  })}
                </Row> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
