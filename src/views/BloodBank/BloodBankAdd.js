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
      bloodBankName: '',
      bloodBankNo: '',
      bloodBankAddress: '',
      bloodBankLocation: null,
      error: {
        bloodBankName: '',
        bloodBankNo: '',
        bloodBankAddress: ''
      },
      invalid: {
        bloodBankName: false,
        bloodBankNo: false,
        bloodBankAddress: false
      },
      valid: {
        bloodBankName: false,
        bloodBankNo: false,
        bloodBankAddress: false
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
    // let edit = get(this.props, 'location.state.edit', false);
    // if (edit) {
    //   let {
    //     vehicleModel = '',
    //     vehicleName = '',
    //     vehicleNo = '',
    //     year = '',
    //     licensePlate = '',
    //     hospitalAddress = '',
    //     hospitalName = '',
    //     hospitalNo = '',
    //     deviceId = '',
    //     _id = '',
    //     vehicleSupportType = '',
    //     hospitalLocation = {}
    //   } = this.props.location.state;
    //   this.setState({
    //     vehicleModel,
    //     vehicleName,
    //     vehicleNo,
    //     year,
    //     licensePlate,
    //     hospitalAddress,
    //     hospitalName,
    //     edit,
    //     _id,
    //     hospitalNo,
    //     deviceId,
    //     vehicleSupportType,
    //     hospitalLocation
    //   });
    // }
  }
  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };
  getGeocode = async () => {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
      this.state.bloodBankName + ' ' + this.state.bloodBankAddress
    )}&key=${config.GEOCODEAPI}`;
    let options = {
      method: 'get',
      url
    };
    await callApi('get', url)
      .then(response => {
        let location = get(response.data, 'results[0].geometry.location', {});
        this.setState({
          bloodBankLocation: {
            ...this.state.bloodBankLocation,
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
    if (this.checkValidation()) {
      await this.getGeocode();
      let {
        bloodBankName = '',
        bloodBankNo = '',
        bloodBankAddress = '',
        bloodBankLocation
        // hospitalAddress = '',
        // hospitalName = '',
        // licensePlate = '',
        // year = '',
        // hospitalNo = '',
        // deviceId = '',
        // vehicleSupportType,
        // hospitalLocation
      } = this.state;
      let headers = {
        'Content-type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${this.props.extraProps.accessToken}`
      };
      // bloodBankLocation = [parseFloat(bloodBankLocation.lat), parseFloat(bloodBankLocation.long)];
      let data = {
        bloodBankName,
        bloodBankNo,
        bloodBankAddress,
        bloodBankLocation
        // hospitalName,
        // hospitalAddress,
        // hospitalLocation,
        // year,
        // licensePlate,
        // hospitalNo,
        // deviceId,
        // vehicleSupportType
      };
      let options = {
        method: 'post',
        url: '/v1/daffo/dispatch/assignBloodBank',
        data,
        headers
      };
      callWebService(options)
        .then(resp => {
          console.log('respponse>>>>', resp.data);
          this.props.history.push({
            pathname: '/home/bloodbank',
            state: { ambulanceId: resp.data }
          });
        })
        .catch(error => {
          console.log('------------', error.response);
        });
    }
  };
  onUpdate = async () => {
    if (this.checkValidation()) {
      await this.getGeocode();
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
        hospitalLocation
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
            hospitalLocation
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
      bloodBankName = '',
      bloodBankNo = '',
      bloodBankAddress = ''
    } = this.state;
    const validbloodBankName = isValidField(bloodBankName);
    // const validVehicleModel = isValidField(vehicleModel);
    // const validbloodBankNo = isValidField(bloodBankNo);
    const validbloodBankNo = isValidPhoneNumber(bloodBankNo);
    const validbloodBankAddress = isValidField(bloodBankAddress);
    // const validHospitalAddress = isValidField(hospitalAddress);
    // const validLicensePlate = isValidField(licensePlate);
    // const validYear = isValidYear(year);
    // const validDeviceId = isValidField(deviceId);
    if (!validbloodBankName.valid) {
      this.setState({
        error: {
          ...error,
          bloodBankName: validbloodBankName.message.replace('{{Field}}', 'Blood Bank Name')
        },
        invalid: { ...invalid, bloodBankName: true },
        valid: { ...valid, bloodBankName: true }
      });
      return false;
    } else if (!validbloodBankNo.valid) {
      this.setState({
        error: {
          ...error,
          bloodBankNo: validbloodBankNo.message.replace('{{Field}}', 'Blood Bank number')
        },
        invalid: { ...invalid, bloodBankNo: true },
        valid: { ...valid, bloodBankNo: false }
      });
      return false;
    } else if (!validbloodBankAddress.valid) {
      //   console.log('>>>>>>>>>', bloodBankAddress);
      this.setState({
        error: {
          ...error,
          bloodBankAddress: validbloodBankAddress.message.replace('{{Field}}', 'Blood Bank Address')
        },
        invalid: { ...invalid, bloodBankAddress: true },
        valid: { ...valid, bloodBankAddress: false }
      });
      return false;
    }
    //  else if (!validYear.valid) {
    //   this.setState({
    //     error: { ...error, year: validYear.message },
    //     invalid: { ...invalid, year: true },
    //     valid: { ...valid, year: false }
    //   });
    //   return false;
    // } else if (!validLicensePlate.valid) {
    //   this.setState({
    //     error: {
    //       ...error,
    //       licensePlate: validLicensePlate.message.replace('{{Field}}', 'License Plate')
    //     },
    //     invalid: { ...invalid, licensePlate: true },
    //     valid: { ...valid, licensePlate: false }
    //   });
    //   return false;
    // } else if (!validHospitalName.valid) {
    //   this.setState({
    //     error: {
    //       ...error,
    //       hospitalName: validHospitalName.message.replace('{{Field}}', 'Hospital Name')
    //     },
    //     invalid: { ...invalid, hospitalName: true },
    //     valid: { ...valid, hospitalName: false }
    //   });
    //   return false;
    // } else if (!validHospitalAddress.valid) {
    //   this.setState({
    //     error: {
    //       ...error,
    //       hospitalAddress: validHospitalAddress.message.replace('{{Field}}', 'Hospital Address')
    //     },
    //     invalid: { ...invalid, hospitalAddress: true },
    //     valid: { ...valid, hospitalAddress: false }
    //   });
    //   return false;
    // } else if (!validHospitalNumber.valid) {
    //   this.setState({
    //     error: {
    //       ...error,
    //       hospitalNo: validHospitalNumber.message.replace('{{Field}}', 'Hospital Number')
    //     },
    //     invalid: {
    //       ...invalid,
    //       hospitalNo: true
    //     },
    //     valid: { ...valid, hospitalNo: false }
    //   });
    //   return false;
    // } else if (!validDeviceId.valid) {
    //   this.setState({
    //     error: {
    //       ...error,
    //       deviceId: validDeviceId.message.replace('{{Field}}', 'Device Id')
    //     },
    //     invalid: { ...invalid, deviceId: true },
    //     valid: { ...valid, deviceId: false }
    //   });
    //   return false;
    // }

    this.setState({
      valid: {
        ...valid,
        bloodBankName: true,
        bloodBankNo: true,
        bloodBankAddress: true
        // year: true,
        // licensePlate: true,
        // hospitalName: true,
        // hospitalAddress: true,
        // hospitalNo: true,
        // deviceId: true
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
    return (
      <div>
        <Row>
          <Col>
            <Card container="true">
              <CardHeader>
                <i className="fa fa-align-justify" /> {this.state.edit ? 'Edit Blood Bank' : 'Add Blood Bank'}
              </CardHeader>
              <CardBody>
                {/* <FormGroup>
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
                </FormGroup> */}
                <Row>
                  <Col>
                    <Form>
                      {[
                        {
                          name: 'bloodBankName',
                          type: 'text',
                          value: this.state.bloodBankName,
                          placeholder: 'Enter the Name',
                          id: 'bloodBankName',
                          valid: this.state.valid.bloodBankName,
                          label: 'Name',
                          invalid: this.state.invalid.bloodBankName,
                          formFeedback: this.state.error.bloodBankName
                        },
                        {
                          name: 'bloodBankNo',
                          type: 'text',
                          value: this.state.bloodBankNo,
                          placeholder: 'Enter the Number',
                          id: 'bloodBankNo',
                          valid: this.state.valid.bloodBankNo,
                          label: 'Number',
                          invalid: this.state.invalid.bloodBankNo,
                          formFeedback: this.state.error.bloodBankNo
                        },
                        {
                          name: 'bloodBankAddress',
                          type: 'text',
                          value: this.state.bloodBankAddress,
                          placeholder: 'Enter the Address',
                          id: 'bloodBankAddress',
                          valid: this.state.valid.bloodBankAddress,
                          label: 'Address',
                          invalid: this.state.invalid.bloodBankAddress,
                          formFeedback: this.state.error.bloodBankAddress
                        }
                        // {
                        //   name: 'year',
                        //   type: 'text',
                        //   value: this.state.year,
                        //   placeholder: 'Enter the year',
                        //   id: 'year',
                        //   valid: this.state.valid.year,
                        //   label: 'Year',
                        //   invalid: this.state.invalid.year,
                        //   formFeedback: this.state.error.year
                        // },
                        // {
                        //   name: 'licensePlate',
                        //   type: 'text',
                        //   value: this.state.licensePlate,
                        //   placeholder: 'Enter the license plate',
                        //   id: 'licensePlate',
                        //   valid: this.state.valid.licensePlate,
                        //   label: 'License Plate',
                        //   invalid: this.state.invalid.licensePlate,
                        //   formFeedback: this.state.error.licensePlate
                        // },
                        // {
                        //   name: 'hospitalName',
                        //   type: 'text',
                        //   value: this.state.hospitalName,
                        //   placeholder: 'Enter the hospital name',
                        //   id: 'hospitalName',
                        //   valid: this.state.valid.hospitalName,
                        //   label: 'Hospital Name',
                        //   invalid: this.state.invalid.hospitalName,
                        //   formFeedback: this.state.error.hospitalName
                        // },
                        // {
                        //   name: 'hospitalAddress',
                        //   type: 'text',
                        //   value: this.state.hospitalAddress,
                        //   placeholder: 'Enter the hospital address',
                        //   id: 'hospitalAddress',
                        //   valid: this.state.valid.hospitalAddress,
                        //   label: 'Hospital Address',
                        //   invalid: this.state.invalid.hospitalAddress,
                        //   formFeedback: this.state.error.hospitalAddress
                        // },
                        // {
                        //   name: 'hospitalNo',
                        //   type: 'text',
                        //   value: this.state.hospitalNo,
                        //   placeholder: 'Enter the hospital number',
                        //   id: 'hospitalNo',
                        //   valid: this.state.valid.hospitalNo,
                        //   label: 'Hospital Number',
                        //   invalid: this.state.invalid.hospitalNo,
                        //   formFeedback: this.state.error.hospitalNo
                        // },
                        // {
                        //   name: 'deviceId',
                        //   type: 'text',
                        //   value: this.state.deviceId,
                        //   placeholder: 'Enter the device Id',
                        //   id: 'deviceId',
                        //   valid: this.state.valid.hospitalNo,
                        //   label: 'Device ID',
                        //   invalid: this.state.invalid.deviceId,
                        //   formFeedback: this.state.error.deviceId
                        // }
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
