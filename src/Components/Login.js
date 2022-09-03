import React, { useRef, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import swal from "sweetalert";
import { useAuth } from "../AuthContext/AuthContext";
import { GoogleLogin } from 'react-google-login'
import { gapi } from 'gapi-script'

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loginRedirect, setLoginRedirect] = useState(false);
  const { login, googleLogin } = useAuth();
  const [validated, setValidated] = useState(false);

  window.gapi.load('client:auth2', () => {
    window.gapi.client.init({
      clientId: '325578094316-1nl3h25vjjjrdv46vu6uja442jhvuagv.apps.googleusercontent.com',
      plugin_name: "chat"
    })
  })

  const onSuccess = (res) => {
    const data = res.profileObj
    let username = `${data.givenName}${data.googleId.substr(data.googleId.length - 3)}`
    if (data.familyName.length > 0) {
      username = `${data.givenName}${data.familyName}${data.googleId.substr(data.googleId.length - 4)}`
    }

    googleLogin(data, username.toString().toLowerCase(), setLoginRedirect);
  }
  const onFail = (res) => {
    console.log(res);
    swal("Erorr", "Fail to login with Google", 'error')
  }

  const submitHandler = (e) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity() === true) {
      if (emailRef.current.value && passwordRef.current.value) {
        login(
          emailRef.current.value,
          passwordRef.current.value,
          setLoginRedirect
        );
      }
      else {
        swal("fail", "Nice Try", "error")
      }
    }
    setValidated(true);
  }

  let redirect = null;

  if (loginRedirect) {
    redirect = <Navigate to="/dashboard" />;
  }

  return (
    <div className="bg-primary">
      {redirect}
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
                  <Card className="shadow-lg border-0 rounded-lg">
                    <Card.Header>
                      <h3 className="text-center font-weight-light my-4">
                        Login
                      </h3>
                    </Card.Header>
                    <Card.Body>
                      <Form noValidate validated={validated} onSubmit={submitHandler} method="POST">
                        <Form.Group controlId="email" className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            required
                            type="email"
                            placeholder="Email Address"
                            name='Email'
                            ref={emailRef}
                          />
                        </Form.Group>
                        <Form.Group controlId="password" className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            required
                            type="password"
                            placeholder="Password"
                            name='password'
                            ref={passwordRef}
                          />
                        </Form.Group>
                        <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                          <Link to="/forgot-password" className="small">Forgot Password?</Link>
                          <Button type="submit" className="btn-block">Login</Button>
                        </div>
                      </Form>
                    </Card.Body>
                    <Card.Footer className="text-center py-3">
                      <div className="small mb-2">
                        <Link to="/signup">Need an account? Sign up!</Link>
                      </div>
                      <GoogleLogin
                        clientId="325578094316-1nl3h25vjjjrdv46vu6uja442jhvuagv.apps.googleusercontent.com"
                        buttonText="Login With Google"
                        onSuccess={onSuccess}
                        onFailure={onFail}
                        cookiePolicy={'single_host_origin'}
                      />
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

export default Login;
