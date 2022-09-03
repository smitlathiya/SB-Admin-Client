import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';

const ForgotPassword = () => {
  const { forgotPassword, forgotPass } = useAuth();
  const emailRef = useRef();
  const [validated, setValidated] = useState(false);

  const formHandle = (e) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity() === true) {
      forgotPassword(emailRef.current.value)
      setValidated(false);
      return true
    }
    setValidated(true);
  }

  return (
    <div className="bg-primary">
      <div id="layoutAuthentication">
        <div
          id="layoutAuthentication_content"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <main style={{ width: "100%" }}>
            <div className="container">
              <Row className="justify-content-center">
                <Col lg='5'>
                  <Card className='shadow-lg border-0 rounded-lg'>
                    <Card.Header>
                      <h3 className="text-center font-weight-light my-4">
                        Recover Password
                      </h3>
                    </Card.Header>
                    <Card.Body>
                      {forgotPass ?
                        (<Alert variant='success'>Email has been sent to {forgotPass}. Follow the instructions to reset your password.</Alert>) :
                        (
                          <Form onSubmit={formHandle} noValidate validated={validated}>
                            <Form.Group as={Col} md="12" controlId="email" className="mb-3">
                              <Form.Label>Email Address</Form.Label>
                              <Form.Control
                                required
                                type="email"
                                placeholder="Email Address"
                                name='email'
                                ref={emailRef}
                              />
                            </Form.Group>

                            <div className="mt-4 mb-0">
                              <Button type='submit'>
                                Send
                              </Button>
                            </div>
                          </Form>
                        )}
                    </Card.Body>
                    <Card.Footer className='d-flex align-items-center justify-content-between text-center py-3'>
                      <div className="small">
                        <Link to="/signin">Login</Link>
                      </div>
                      <div className="small">
                        <Link to="/signup">Need an account? Sign up!</Link>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              </Row>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;