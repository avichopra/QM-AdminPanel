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

import Logo from "../../../img/group.png";
import Base from "./ForgotPassword.base";

class ForgotPassword extends Base {
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
                      <h1>Forgot Password</h1>
                      <p className="text-muted">Enter your username</p>
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
                      <Row>
                        <Col xs="6">
                          <Button
                            color="primary"
                            onClick={() => this.onSubmit()}
                            className="px-4"
                          >
                            Submit
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

export default ForgotPassword;
