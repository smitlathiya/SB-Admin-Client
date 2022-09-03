import React, { useRef, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import swal from 'sweetalert';
import { useAuth } from '../AuthContext/AuthContext';

const ChangePasssword = () => {
    const [validated, setValidated] = useState(false);
    const currentPassref = useRef();
    const newPassref = useRef();
    const confirmPassref = useRef();
    const { updatePassword } = useAuth()

    const submitHandler = (e) => {
        e.preventDefault();
        if (e.currentTarget.checkValidity() === true) {
            if (newPassref.current.value === confirmPassref.current.value) {
                const data = {
                    currentPassword: currentPassref.current.value,
                    newPassword: newPassref.current.value
                }
                const success = () => {
                    newPassref.current.value = ''
                    confirmPassref.current.value = ''
                    currentPassref.current.value = ''
                    setValidated(false);
                }
                updatePassword(data, success)
            }
            else {
                swal('Error', 'New password not matched with confirm password', 'error')
            }
        }
        setValidated(true);
    };

    return (
        <Card className='mb-3'>
            <Card.Header>
                Change Passsword
            </Card.Header>
            <Card.Body>
                <Form noValidate validated={validated} onSubmit={submitHandler} method="POST">
                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Current Password"
                            name='password'
                            ref={currentPassref}
                            minLength='6'
                        />
                        <Form.Control.Feedback type="invalid">
                            Password must be 6 character or more
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Password"
                            name='password'
                            ref={newPassref}
                            minLength='6'
                        />
                        <Form.Control.Feedback type="invalid">
                            Password must be 6 character or more
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="cpassword" className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Confirm Password"
                            name='cpassword'
                            ref={confirmPassref}
                            minLength='6'
                        />
                        <Form.Control.Feedback type="invalid">
                            Password must be 6 character or more
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" className="btn-block w-100">Save</Button>
                </Form>
            </Card.Body>
        </Card >
    );
}

export default ChangePasssword;