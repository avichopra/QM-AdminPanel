import React, { Component } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { callWebService } from '../../api';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patientCount: 0,
      driverCount: 0
    };
  }

  componentDidMount() {
    if (this.props.extraProps.accessToken) {
      let headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${this.props.extraProps.accessToken}`
      };
      let data = {
        filter: { deleted: false }
      };
      let options = {
        method: 'post',
        url: '/v1/daffo/Patient/count/',
        data,
        headers
      };
      callWebService(options)
        .then(response => {
          this.setState({ patientCount: response.data.count });
        })
        .catch(error => {
          console.log('error', error);
        });

      callWebService({ ...options, url: '/v1/daffo/Driver/Count' })
        .then(response => {
          this.setState({ driverCount: response.data.count });
        })
        .catch(error => {
          console.log('error', error);
        });
    }
  }

  loading = () => (
    <div className='animated fadeIn pt-1 text-center'>Loading...</div>
  );

  render() {
    return (
      <div className='animated fadeIn'>
        <Row>
          {[
            {
              title: 'Total number of registered drivers',
              value: this.state.driverCount,
              navigate: '/home/driver'
            },
            {
              title: 'Total number of registered users',
              value: this.state.patientCount,
              navigate: '/home/user'
            }
          ].map((item, index) => {
            return (
              <Col xs='12' sm='6' lg='4' key={index}>
                <Card
                  className='text-white bg-primary'
                  onClick={() => this.props.history.push(item.navigate)}
                >
                  <CardBody className='pb-6'>
                    <div>{item.title}</div>
                    <div className='text-value'>{item.value}</div>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}

export default Dashboard;
