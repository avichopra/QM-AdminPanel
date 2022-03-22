import React from "react";

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
} from "reactstrap";
import { connect } from "react-redux";

import Logo from "../../../img/group.png";
import Base from "./Login.base";

class Login extends Base {
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup
                        className={this.state.error.email ? "mb-1" : "mb-3 "}
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          value={this.state.email}
                          placeholder="Username"
                          autoComplete="username"
                          onChange={this.handleChange}
                          name="email"
                        />
                      </InputGroup>
                      {this.state.error.email && (
                        <div style={{ color: "red" }} className="mb-1">
                          {this.state.error.email}
                        </div>
                      )}
                      <InputGroup
                        className={this.state.error.password ? "mb-1" : "mb-4"}
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          value={this.state.value}
                          onChange={this.handleChange}
                          name="password"
                        />
                      </InputGroup>
                      {this.state.error.password && (
                        <div style={{ color: "red" }} className="mb-2">
                          {this.state.error.password}
                        </div>
                      )}
                      <Row>
                        <Col xs="6">
                          <Button
                            color="primary"
                            onClick={this.onSubmit}
                            className="px-4"
                          >
                            Login
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button
                            color="link"
                            onClick={() =>
                              this.props.history.push("/forgotPassword")
                            }
                            className="px-0"
                          >
                            Forgot password?
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card
                  className="bg-primary p-3 d-md-down-none"
                  style={{ width: "44%" }}
                >
                  <CardImg src={Logo} alt="Quick Medic logo" />
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user.user,
    userErr: state.user.userErr
  };
}

export default connect(mapStateToProps)(Login);
