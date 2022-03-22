import React from 'react';

import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  CardImg
} from 'reactstrap';

import Logo from '../../../img/group.png';
import Base from './ResetPassword.base';

class ResetPassword extends Base {
  render() {
    return (
      <div className='app flex-row align-items-center'>
        <Container>
          <Row className='justify-content-center'>
            <Col md='8'>
              <CardGroup>
                <Card className='p-4'>
                  <CardBody>
                    <Form>
                      <h1>Reset Password</h1>
                      <p className='text-muted'>
                        Reset password of your account
                      </p>
                      <InputGroup
                        className={this.state.error.password ? 'mb-1' : 'mb-3'}
                      >
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            <i className='icon-lock' />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type='password'
                          placeholder='Password'
                          autoComplete='current-password'
                          value={this.state.password}
                          onChange={this.handleChange}
                          name='password'
                        />
                      </InputGroup>
                      {this.state.error.password && (
                        <div style={{ color: 'red' }} className='mb-1'>
                          {this.state.error.password}
                        </div>
                      )}
                      <InputGroup
                        className={
                          this.state.error.confrimPasword ? 'mb-1' : 'mb-4'
                        }
                      >
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            <i className='icon-lock' />
                          </InputGroupText>
                        </InputGroupAddon>

                        <Input
                          type='password'
                          placeholder='Confirm Password'
                          autoComplete='confirm-password'
                          value={this.state.confirmPassword}
                          onChange={this.handleChange}
                          name='confirmPassword'
                        />
                      </InputGroup>
                      {this.state.error.confrimPasword && (
                        <div style={{ color: 'red' }} className='mb-2'>
                          {this.state.error.confrimPasword}
                        </div>
                      )}
                      <Row>
                        <Col xs='8'>
                          <Button
                            color='primary'
                            onClick={this.onSubmit}
                            className='px-6'
                          >
                            Reset Password
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card
                  className='bg-primary p-3 d-md-down-none'
                  style={{ width: '44%' }}
                >
                  <CardImg src={Logo} alt='Quick Medic logo' />
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ResetPassword;
