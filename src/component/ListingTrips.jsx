import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
export class ListingTrips extends Component {
  render() {
    return (
      <ListGroup>
        <ListGroupItem>
          {this.props.item.map((item, index) => {
            return (
              <Row key={index}>
                <Col sm='2'>{`${item.label}`}</Col>
                <Col sm='10'>{`${item.value}`}</Col>
              </Row>
            );
          })}
        </ListGroupItem>
      </ListGroup>
    );
  }
}

export default ListingTrips;
