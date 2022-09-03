import React, { useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { useAuth } from "../AuthContext/AuthContext";

const Registration = () => {

  const { signup } = useAuth();
  const [validated, setValidated] = useState(false);

  const [signupData, setSignupData] = useState({
    fname: '',
    lname: '',
    email: '',
    username: '',
    password: '',
    cpassword: ''
  });


  const submitHandler = (e) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity() === true) {
      const { fname, lname, email, username, password, cpassword } = signupData;
      if (fname && lname && email && username && password) {
        if (password === cpassword) {
          signup(fname, lname, email, username, password)
          setSignupData({
            fname: '',
            lname: '',
            email: '',
            username: '',
            password: '',
            cpassword: ''
          })
          setValidated(false);
          return true;
        }
        else {
          swal("fail", "Password Does not Matched", "error")
        }
      }
      else {
        swal("fail", "Genjutsu of that level doesn't work on me", "error")
      }
    }
    setValidated(true);
  };

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setSignupData({ ...signupData, [name]: value })
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
                <Col lg="7">
                  <Card className="shadow-lg border-0 rounded-lg">
                    <Card.Header>
                      <h3 className="text-center font-weight-light my-4">
                        Create Account
                      </h3>
                    </Card.Header>
                    <Card.Body>
                      <Form noValidate validated={validated} onSubmit={submitHandler} method="POST">
                        <Row className="mb-3">
                          <Form.Group as={Col} md="6" controlId="fname" className="mb-3">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="First name"
                              name='fname'
                              onChange={onChangeHandler}
                              value={signupData.fname || ''}
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="6" controlId="lname" className="mb-3">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Last name"
                              name='lname'
                              onChange={onChangeHandler}
                              value={signupData.lname || ''}
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="12" controlId="email" className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              required
                              type="email"
                              placeholder="Email Address"
                              name='email'
                              onChange={onChangeHandler}
                              value={signupData.email || ''}
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="12" controlId="username" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Username"
                              name='username'
                              onChange={onChangeHandler}
                              value={signupData.username || ''}
                              pattern="[a-z0-9._]+"
                            />
                            <Form.Control.Feedback type="invalid">
                              Username content must be a-z 0-9
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group as={Col} md="6" controlId="password" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              required
                              type="password"
                              placeholder="Password"
                              name='password'
                              onChange={onChangeHandler}
                              value={signupData.password || ''}
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="6" controlId="cpassword" className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                              required
                              type="password"
                              placeholder="Confirm Password"
                              name='cpassword'
                              onChange={onChangeHandler}
                              value={signupData.cpassword || ''}
                            />
                          </Form.Group>
                        </Row>
                        <Button type="submit" className="btn-block w-100">Create Account</Button>
                      </Form>
                    </Card.Body>
                    <Card.Footer className='text-center py-3'>
                      <div className="small">
                        Have an account? Go to &nbsp;
                        <Link to="/signin">login</Link>
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
};

export default Registration;
