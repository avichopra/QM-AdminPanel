import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Form, Row, Label, Input, FormGroup } from 'reactstrap';
import 'font-awesome/css/font-awesome.min.css';
import { InputField } from '../../component/Form';
import { callWebService, callApi } from '../../api';
import { isValidField, isValidYear, isValidPhoneNumber } from '../../validation';
import { get } from 'lodash';
import config from '../../config';
export default class AmbulanceAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicleName: '',
      vehicleNo: '',
      vehicleModel: '',
      year: '',
      licensePlate: '',
      hospitalName: '',
      hospitalAddress: '',
      lag: '',
      long: '',
      edit: false,
      hospitalNo: '',
      deviceId: '',
      _id: '',
      hospitalLocation: null,
      hospitalLat: null,
      hospitalLong: null,
      vehicleSupportType: 'Basic',
      hospitalType: 'Private',
      error: {
        vehicleName: '',
        vehicleNo: '',
        vehicleModel: '',
        year: '',
        licensePlate: '',
        hospitalName: '',
        hospitalAddress: '',
        hospitalNo: '',
        hospitalLat: '',
        hospitalLong: '',
        deviceId: ''
      },
      invalid: {
        vehicleName: false,
        vehicleNo: false,
        vehicleModel: false,
        year: false,
        licensePlate: false,
        hospitalName: false,
        hospitalAddress: false,
        hospitalNo: false,
        hospitalLat: false,
        hospitalLong: false,
        deviceId: false
      },
      valid: {
        vehicleName: false,
        vehicleNo: false,
        vehicleModel: false,
        year: false,
        licensePlate: false,
        hospitalName: false,
        hospitalAddress: false,
        hospitalNo: false,
        hospitalLat: false,
        hospitalLong: false,
        deviceId: false
      }
    };
  }
  // toggle = () => {
  //   this.setState(prevState => ({
  //     vehicleSupportType: !prevState.vehicleSupportType
  //   }));
  //   console.log(this.state.vehicleSupportType);
  // };
  componentDidMount() {
    let edit = get(this.props, 'location.state.edit', false);
    if (edit) {
      let {
        vehicleModel = '',
        vehicleName = '',
        vehicleNo = '',
        year = '',
        licensePlate = '',
        hospitalAddress = '',
        hospitalName = '',
        hospitalNo = '',
        deviceId = '',
        _id = '',
        vehicleSupportType = '',
        hospitalType = '',
        hospitalLocation = {}
      } = this.props.location.state;
      this.setState({
        vehicleModel,
        vehicleName,
        vehicleNo,
        year,
        licensePlate,
        hospitalAddress,
        hospitalName,
        edit,
        _id,
        hospitalNo,
        deviceId,
        vehicleSupportType,
        hospitalLocation,
        hospitalType
      });
    }
  }
  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };
  getGeocode = async () => {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
      this.state.hospitalName + ' ' + this.state.hospitalAddress
    )}&key=${config.GEOCODEAPI}`;
    let options = {
      method: 'get',
      url
    };
    await callApi('get', url)
      .then(response => {
        let location = get(response.data, 'results[0].geometry.location', {});
        this.setState({
          hospitalLocation: {
            ...this.state.hospitalLocation,
            lat: location.lat,
            long: location.lng
          }
        });
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  onSubmit = async () => {
    let { hospitalLat, hospitalLong }  = this.state
    if (this.checkValidation()) {
      hospitalLat != null && hospitalLong != null && await this.getGeocode();
      let {
        vehicleModel = '',
        vehicleName = '',
        vehicleNo = '',
        hospitalAddress = '',
        hospitalName = '',
        licensePlate = '',
        year = '',
        hospitalNo = '',
        deviceId = '',
        vehicleSupportType,
        hospitalLocation,
        hospitalType
      } = this.state;
      let headers = {
        'Content-type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${this.props.extraProps.accessToken}`
      };
      let data = {
        vehicleName,
        vehicleModel,
        vehicleNo,
        hospitalName,
        hospitalAddress,
        hospitalLocation : hospitalLat != null && hospitalLong != null ? { lat: parseFloat(hospitalLat),long: parseFloat(hospitalLong) }  : hospitalLocation,
        year,
        licensePlate,
        hospitalNo,
        deviceId,
        vehicleSupportType,
        hospitalType
      };
      let options = {
        method: 'post',
        url: '/v1/daffo/Ambulance/create',
        data,
        headers
      };
      callWebService(options)
        .then(resp => {
          console.log('resp', resp.data);
          this.props.history.push({
            pathname: `/home/ambulance/add/driver/?id=${resp.data._id}`,
            state: { ambulanceId: resp.data }
          });
        })
        .catch(error => {
          console.log('------------', error.response);
        });
    }
  };
  onUpdate = async () => {
    let { hospitalLat, hospitalLong }  = this.state
    if (this.checkValidation()) {
      hospitalLat != null && hospitalLong != null && await this.getGeocode();
      let {
        vehicleModel = '',
        vehicleName = '',
        vehicleNo = '',
        hospitalAddress = '',
        hospitalName = '',
        licensePlate = '',
        year = '',
        hospitalNo = '',
        deviceId = '',
        vehicleSupportType,
        hospitalLocation,
        hospitalType
      } = this.state;
      let headers = {
        'Content-type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${this.props.extraProps.accessToken}`
      };

      let data = {
        setter: {
          $set: {
            vehicleName,
            vehicleModel,
            vehicleNo,
            hospitalName,
            hospitalAddress,
            year,
            licensePlate,
            hospitalNo,
            deviceId,
            vehicleSupportType,
            hospitalLocation : hospitalLat != null && hospitalLong != null ? { lat: parseFloat(hospitalLat),long: parseFloat(hospitalLong) }  : hospitalLocation,
            hospitalType
          }
        },
        filter: { _id: this.state._id }
      };
      let options = {
        method: 'patch',
        url: '/v1/daffo/Ambulance/update',
        data,
        headers
      };
      callWebService(options)
        .then(resp => {
          console.log('resp', resp.data);
          this.props.history.push({
            pathname: `/home/ambulance/`
          });
        })
        .catch(error => {
          console.log('------------', error.response);
        });
    }
  };
  checkValidation = () => {
    const {
      error = {},
      invalid = {},
      valid = {},
      hospitalAddress = '',
      hospitalName = '',
      vehicleName = '',
      vehicleModel = '',
      vehicleNo = '',
      licensePlate = '',
      year = '',
      hospitalNo = '',
      deviceId = ''
    } = this.state;
    const validVehicleName = isValidField(vehicleName);
    const validVehicleModel = isValidField(vehicleModel);
    const validVehicleNo = isValidField(vehicleNo);
    const validHospitalName = isValidField(hospitalName);
    const validHospitalAddress = isValidField(hospitalAddress);
    const validLicensePlate = isValidField(licensePlate);
    const validYear = isValidYear(year);
    const validHospitalNumber = isValidPhoneNumber(hospitalNo);
    const validDeviceId = isValidField(deviceId);
    if (!validVehicleName.valid) {
      this.setState({
        error: {
          ...error,
          vehicleName: validVehicleName.message.replace('{{Field}}', 'Vehicle Name')
        },
        invalid: { ...invalid, vehicleName: true },
        valid: { ...valid, vehicleName: true }
      });
      return false;
    } else if (!validVehicleNo.valid) {
      this.setState({
        error: {
          ...error,
          vehicleNo: validVehicleNo.message.replace('{{Field}}', 'Vehicle number')
        },
        invalid: { ...invalid, vehicleNo: true },
        valid: { ...valid, vehicleNo: false }
      });
      return false;
    } else if (!validVehicleModel.valid) {
      this.setState({
        error: {
          ...error,
          vehicleModel: validVehicleModel.message.replace('{{Field}}', 'Vehicle Model')
        },
        invalid: { ...invalid, vehicleModel: true },
        valid: { ...valid, vehicleModel: false }
      });
      return false;
    } else if (!validYear.valid) {
      this.setState({
        error: { ...error, year: validYear.message },
        invalid: { ...invalid, year: true },
        valid: { ...valid, year: false }
      });
      return false;
    } else if (!validLicensePlate.valid) {
      this.setState({
        error: {
          ...error,
          licensePlate: validLicensePlate.message.replace('{{Field}}', 'License Plate')
        },
        invalid: { ...invalid, licensePlate: true },
        valid: { ...valid, licensePlate: false }
      });
      return false;
    } else if (!validHospitalName.valid) {
      this.setState({
        error: {
          ...error,
          hospitalName: validHospitalName.message.replace('{{Field}}', 'Hospital Name')
        },
        invalid: { ...invalid, hospitalName: true },
        valid: { ...valid, hospitalName: false }
      });
      return false;
    } else if (!validHospitalAddress.valid) {
      this.setState({
        error: {
          ...error,
          hospitalAddress: validHospitalAddress.message.replace('{{Field}}', 'Hospital Address')
        },
        invalid: { ...invalid, hospitalAddress: true },
        valid: { ...valid, hospitalAddress: false }
      });
      return false;
    } else if (!validHospitalNumber.valid) {
      this.setState({
        error: {
          ...error,
          hospitalNo: validHospitalNumber.message.replace('{{Field}}', 'Hospital Number')
        },
        invalid: {
          ...invalid,
          hospitalNo: true
        },
        valid: { ...valid, hospitalNo: false }
      });
      return false;
    } else if (!validDeviceId.valid) {
      this.setState({
        error: {
          ...error,
          deviceId: validDeviceId.message.replace('{{Field}}', 'Device Id')
        },
        invalid: { ...invalid, deviceId: true },
        valid: { ...valid, deviceId: false }
      });
      return false;
    }

    this.setState({
      valid: {
        ...valid,
        vehicleName: true,
        vehicleNo: true,
        vehicleModel: true,
        year: true,
        licensePlate: true,
        hospitalName: true,
        hospitalAddress: true,
        hospitalNo: true,
        deviceId: true
      }
    });
    return true;
  };
  onChange = event => {
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

  render() {
    // console.log('>>>>hospital type>>', this.state.hospitalType);
    return (
      <div>
        <Row>
          <Col>
            <Card container="true">
              <CardHeader>
                <i className="fa fa-align-justify" /> {this.state.edit ? 'Edit Ambulance' : 'Add Ambulance'}
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Row>
                    <Col sm="2">Ambulance type</Col>
                    <Col sm="10">
                      <Row>
                        <Col sm="4">
                          <Label check>
                            <Input
                              type="radio"
                              name="vehicleSupportType"
                              value={'Basic'}
                              checked={this.state.vehicleSupportType === 'Basic' ? true : false}
                              onChange={() => {
                                this.setState({ vehicleSupportType: 'Basic' });
                              }}
                            />
                            {'Basic'}
                          </Label>
                        </Col>
                        <Col sm="4">
                          <Label check>
                            <Input
                              type="radio"
                              name="vehicleSupportType"
                              value={'Advance'}
                              checked={this.state.vehicleSupportType === 'Advance' ? true : false}
                              onChange={() => {
                                this.setState({
                                  vehicleSupportType: 'Advance'
                                });
                              }}
                            />
                            {'Advance'}
                          </Label>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col sm="2">Hospital Type</Col>
                    <Col sm="10">
                      <Row>
                        <Col sm="4">
                          <Label check>
                            <Input
                              type="radio"
                              name="hospitalType"
                              value={'Private'}
                              checked={this.state.hospitalType === 'Private' ? true : false}
                              onChange={() => {
                                this.setState({ hospitalType: 'Private' });
                              }}
                            />
                            {'Private'}
                          </Label>
                        </Col>
                        <Col sm="4">
                          <Label check>
                            <Input
                              type="radio"
                              name="hospitalType"
                              value={'Govt'}
                              checked={this.state.hospitalType === 'Govt' ? true : false}
                              onChange={() => {
                                this.setState({
                                  hospitalType: 'Govt'
                                });
                              }}
                            />
                            {'Govt'}
                          </Label>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </FormGroup>
                <Row>
                  <Col>
                    <Form>
                      {[
                        {
                          name: 'vehicleName',
                          type: 'text',
                          value: this.state.vehicleName,
                          placeholder: 'Enter the vehicle name',
                          id: 'vehicleName',
                          valid: this.state.valid.vehicleName,
                          label: 'Vehicle Name',
                          invalid: this.state.invalid.vehicleName,
                          formFeedback: this.state.error.vehicleName
                        },
                        {
                          name: 'vehicleNo',
                          type: 'text',
                          value: this.state.vehicleNo,
                          placeholder: 'Enter the vehicle number',
                          id: 'vehicleNo',
                          valid: this.state.valid.vehicleNo,
                          label: 'Vehicle Number',
                          invalid: this.state.invalid.vehicleNo,
                          formFeedback: this.state.error.vehicleNo
                        },
                        {
                          name: 'vehicleModel',
                          type: 'text',
                          value: this.state.vehicleModel,
                          placeholder: 'Enter the vehicle model',
                          id: 'vehicleModel',
                          valid: this.state.valid.vehicleModel,
                          label: 'Vehicle Model',
                          invalid: this.state.invalid.vehicleModel,
                          formFeedback: this.state.error.vehicleModel
                        },
                        {
                          name: 'year',
                          type: 'text',
                          value: this.state.year,
                          placeholder: 'Enter the year',
                          id: 'year',
                          valid: this.state.valid.year,
                          label: 'Year',
                          invalid: this.state.invalid.year,
                          formFeedback: this.state.error.year
                        },
                        {
                          name: 'licensePlate',
                          type: 'text',
                          value: this.state.licensePlate,
                          placeholder: 'Enter the license plate',
                          id: 'licensePlate',
                          valid: this.state.valid.licensePlate,
                          label: 'License Plate',
                          invalid: this.state.invalid.licensePlate,
                          formFeedback: this.state.error.licensePlate
                        },
                        {
                          name: 'hospitalName',
                          type: 'text',
                          value: this.state.hospitalName,
                          placeholder: 'Enter the hospital name',
                          id: 'hospitalName',
                          valid: this.state.valid.hospitalName,
                          label: 'Hospital Name',
                          invalid: this.state.invalid.hospitalName,
                          formFeedback: this.state.error.hospitalName
                        },
                        {
                          name: 'hospitalAddress',
                          type: 'text',
                          value: this.state.hospitalAddress,
                          placeholder: 'Enter the hospital address',
                          id: 'hospitalAddress',
                          valid: this.state.valid.hospitalAddress,
                          label: 'Hospital Address',
                          invalid: this.state.invalid.hospitalAddress,
                          formFeedback: this.state.error.hospitalAddress
                        },
                        {
                          name: 'hospitalNo',
                          type: 'text',
                          value: this.state.hospitalNo,
                          placeholder: 'Enter the hospital number',
                          id: 'hospitalNo',
                          valid: this.state.valid.hospitalNo,
                          label: 'Hospital Number',
                          invalid: this.state.invalid.hospitalNo,
                          formFeedback: this.state.error.hospitalNo
                        },
                        {
                          name: "hospitalLat",
                          type: "text",
                          value: this.state.hospitalLat,
                          placeholder: "Enter the hospital Latitude",
                          id: "hospitalLatitude",
                          label: 'Hospital Latitude',
                        },
                        {
                          name: "hospitalLong",
                          type: "text",
                          value: this.state.hospitalLong,
                          placeholder: "Enter the hospital Longitude",
                          id: "hospitalLongitude",
                          label: 'Hospital Longitude',
                        },
                        {
                          name: 'deviceId',
                          type: 'text',
                          value: this.state.deviceId,
                          placeholder: 'Enter the device Id',
                          id: 'deviceId',
                          valid: this.state.valid.hospitalNo,
                          label: 'Device ID',
                          invalid: this.state.invalid.deviceId,
                          formFeedback: this.state.error.deviceId
                        }
                      ].map((item, index) => {
                        return (
                          <Row key={index}>
                            <Col>
                              <InputField
                                label={item.label}
                                type={item.type}
                                name={item.name}
                                valid={item.valid}
                                placeholder={item.placeholder}
                                value={item.value}
                                invalid={item.invalid}
                                onChange={event => this.onChange(event)}
                                formFeedback={item.formFeedback}
                                id={item.id}
                              />
                            </Col>
                          </Row>
                        );
                      })}
                      {/* <FormGroup>
                        <Row>
                          <Col sm="2">
                            <Label>Lag</Label>
                          </Col>
                          <Col sm="10">
                            <Input
                              type={'text'}
                              name={'lag'}
                              id={'lag'}
                              value={this.state.lag}
                            />
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col sm="2">
                            <Label>Long</Label>
                          </Col>
                          <Col sm="10">
                            <Input
                              type={'text'}
                              name={'long'}
                              id={'long'}
                              value={this.state.long}
                            />
                          </Col>
                        </Row>
                      </FormGroup> */}

                      <Row className="justify-content-center">
                        <Col xs="4">
                          <Button
                            size="lg"
                            color={'success'}
                            outline
                            onClick={this.state.edit ? () => this.onUpdate() : () => this.onSubmit()}
                            block
                          >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
