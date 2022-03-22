import React, { Component } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormFeedback,
  Input,
  Label,
  Row
} from 'reactstrap';
import 'font-awesome/css/font-awesome.min.css';

export class FormClass extends Component {
  render() {
    const {
      inputFields = [],
      onChange = () => {},
      onClick = () => {}
    } = this.props;
    return (
      <Row>
        <Col>
          <Card container="true">
            <CardHeader>
              <h3>{this.props.title}</h3>
            </CardHeader>
            <CardBody>
              <Form className="form">
                {inputFields.map((item, index) => {
                  return (
                    <InputField
                      label={item.label}
                      type={item.type}
                      name={item.name}
                      valid={item.valid}
                      placeholder={item.placeholder}
                      value={item.value}
                      invalid={item.invalid}
                      onChange={event => onChange(event)}
                      formFeedback={item.formFeedback}
                      id={item.id}
                      key={index}
                    />
                  );
                })}
                <Row className="justify-content-center ">
                  <Col xs="4">
                    <Button
                      size="lg"
                      color={'success'}
                      outline
                      onClick={onClick}
                      block
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export const InputField = props => {
  const {
    type = 'text',
    label = '',
    valid = false,
    invalid = false,
    name = '',
    id = '',
    placeholder = '',
    formFeedback = '',
    value = '',
    onChange = () => {}
  } = props;
  return (
    <FormGroup>
      <Row className={'sm-10 '}>
        <Col sm={2} className={'align-self-start '}>
          {label && (
            <Label for={id} size="md">
              {label}
            </Label>
          )}
        </Col>
        <Col sm={10}>
          <Input
            type={type}
            name={name}
            id={id}
            placeholder={placeholder}
            valid={valid}
            invalid={invalid}
            value={value}
            onChange={onChange}
          />
          <FormFeedback size="lg" invalid={invalid.toString()}>
            {formFeedback}
          </FormFeedback>
        </Col>
      </Row>
    </FormGroup>
  );
};
export default FormClass;
