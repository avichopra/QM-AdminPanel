import React, { Component, Fragment } from 'react';
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';

import 'font-awesome/css/font-awesome.min.css';

export class Tables extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      UncontrolledTooltipOpen: false,
      deleteItem: {},
      modal: false
    };
  }

  toggle() {
    this.setState({
      UncontrolledTooltipOpen: !this.state.UncontrolledTooltipOpen
    });
  }
  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };
  render() {
    const {
      title = '',
      headers = [],
      tableData = [],
      tableHeaders = [],
      formLink = () => {},
      addIcon = false,
      paginationArray = [],
      onChangeCount = () => {},
      block = () => {}
    } = this.props;

    let body = tableData.map((item, ind) => {
      return (
        <tr key={ind}>
          {tableHeaders.map((key, index) => {
            let cellValue = '';

            if (key.indexOf('.') > -1) {
              let keys = key.split('.');

              cellValue =
                item[keys[0]] &&
                (keys.length === 2
                  ? item[keys[0]][keys[1]]
                  : item[keys[0]][keys[1]][keys[2]]);
            } else {
              cellValue = item[key];
            }
            if (key.includes('status')) {
              return cellValue ? (
                <td key={index} style={{ minWidth: 150 }}>
                  <h3>
                    <Badge color='success' pill>
                      Active
                    </Badge>
                  </h3>
                </td>
              ) : (
                <td key={index} style={{ minWidth: 150 }}>
                  <h3>
                    <Badge color='dark' pill>
                      Inactive
                    </Badge>
                  </h3>
                </td>
              );
            }

            return key === 'action' ? (
              <td key={index}>
                <Row className='d-inline-flex flex-sm-row'>
                  {title === 'Driver' && (
                    <Col>
                      <Button
                        color='primary'
                        title={`Detail ${item[tableHeaders[0]]}`}
                        onClick={() => {
                          this.props.detailPage(item._id);
                        }}
                      >
                        <i className='fa fa-info' />
                      </Button>
                    </Col>
                  )}
                  <Col>
                    <Button
                      color={item['status'] ? 'danger' : 'primary'}
                      title={
                        item['status']
                          ? `Block ${
                              title === 'Ambulance'
                                ? item['ambulanceId']['vehicleName']
                                : item[tableHeaders[0]]
                            }`
                          : `Unblock ${
                              title === 'Ambulance'
                                ? item['ambulanceId']['vehicleName']
                                : item[tableHeaders[0]]
                            }`
                      }
                      onClick={() => block(item._id, item.status)}
                    >
                      <i className='fa fa-ban ' />
                    </Button>
                  </Col>

                  <Col>
                    <Button
                      color='success'
                      onClick={() => formLink({ ...item, title })}
                      title={`Edit ${
                        title === 'Ambulance'
                          ? item['ambulanceId']['vehicleName']
                          : item[tableHeaders[0]]
                      }`}
                    >
                      <i className='fa fa-edit' />
                    </Button>
                  </Col>

                  <Col>
                    <Button
                      color='danger'
                      title={`Delete ${
                        title === 'Ambulance'
                          ? item['ambulanceId']['vehicleName']
                          : item[tableHeaders[0]]
                      }`}
                      onClick={() => {
                        this.setState({ deleteItem: item });
                        this.toggleModal();
                      }}
                    >
                      <i className='fa fa-trash' />
                    </Button>
                  </Col>
                </Row>
              </td>
            ) : (
              <td key={index} style={{ minWidth: 150 }}>
                {cellValue !== 'undefined' ? cellValue : '-'}
              </td>
            );
          })}
        </tr>
      );
    });
    return (
      <Fragment>
        <Row>
          <Col>
            <Card>
              {title && (
                <CardHeader>
                  <Row className='align-items-center'>
                    <Col>
                      <i className='fa fa-align-justify' /> {title}
                    </Col>
                    <Col className={' d-flex justify-content-end'}>
                      {addIcon && (
                        <Button
                          color='primary'
                          onClick={() => this.props.addLink()}
                          title='Add Driver'
                        >
                          <i className='fa fa-plus-square' />
                        </Button>
                      )}
                    </Col>
                  </Row>
                </CardHeader>
              )}
              <CardBody>
                <Table hover responsive size='sm' sm={10}>
                  <thead>
                    <tr>
                      {headers.map((item, index) => {
                        return <th key={index}>{item}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>{body}</tbody>
                </Table>
                <nav>
                  {paginationArray && (
                    <Pagination>
                      {paginationArray.map((item, index) => {
                        return (
                          <PaginationItem key={index}>
                            <PaginationLink
                              previous
                              tag='button'
                              onClick={() => onChangeCount(item)}
                            >
                              {item}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                    </Pagination>
                  )}
                </nav>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className={this.props.className}
        >
          <ModalHeader
            toggle={this.toggleModal}
          >{`Delete ${title}`}</ModalHeader>
          <ModalBody>{`Do you want delete this "${
            title === 'Ambulance'
              ? this.state.deleteItem['ambulanceId'] &&
                this.state.deleteItem['ambulanceId']['vehicleName']
              : this.state.deleteItem[tableHeaders[0]]
          }"?`}</ModalBody>
          <ModalFooter>
            <Button
              color='primary'
              onClick={() => {
                this.props.delete(this.state.deleteItem._id);
                this.toggleModal();
              }}
            >
              Delete
            </Button>
            <Button color='secondary' onClick={this.toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

export default Tables;
