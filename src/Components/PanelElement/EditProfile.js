import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import swal from "sweetalert";
import { useAuth } from "../../AuthContext/AuthContext";
import ChangePasssword from "../changePasssword";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import { Country, State, City } from 'country-state-city';

const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [userData, setUserData] = useState({
    name: {
      firstName: "",
      lastName: "",
    },
    email: "",
    password: "",
    designation: "",
    date_of_birth: "",
    address: {
      city: "",
      state: "",
      country: "",
    },
    phoneNo: "",
    website: "",
  });
  const { authData, editProfile } = useAuth()
  const formData = new FormData();

  const [allCountry, setAllCountry] = useState([]);
  const [stateOfCountry, setStateOfCountry] = useState([]);
  const [cityOfState, setCityOfState] = useState([]);

  useEffect(() => {
    setLoading(true)
    setAllCountry(Country.getAllCountries())

    if (authData) {
      axios
        .get(`/user/${authData.id}`, {
          headers: {
            Accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
        })
        .then((res) => {
          const data = res.data;

          setUserData({
            name: {
              firstName: data.name.first_name,
              lastName: data.name.last_name,
            },
            email: data.email,
            designation: data.designation,
            date_of_birth: data.date_of_birth,
            address: {
              city: data.address.city,
              state: data.address.state,
              country: data.address.country,
            },
            phoneNo: data.phone_no != undefined ? data.phone_no : '',
            website: data.website,
          });
          setLoading(false)
        })
        .catch((e) => {
          swal("faild", "Somthing Went Wrong", "error")
          setLoading(false)
        })
    }

  }, [authData]);

  useEffect(() => {
    if (userData.address.country != '') {
      setStateOfCountry(State.getStatesOfCountry(userData.address.country))
    } else {
      setStateOfCountry([])
    }
  }, [userData.address.country]);

  useEffect(() => {
    if (userData.address.country != '' || userData.address.state != '') {
      setCityOfState(City.getCitiesOfState(userData.address.country, userData.address.state))
    } else {
      setCityOfState([])
    }
  }, [userData.address.country, userData.address.state]);


  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity() === true) {
      formData.append("first_name", userData.name.firstName);
      formData.append("last_name", userData.name.lastName);
      formData.append("email", userData.email);
      formData.append("designation", userData.designation);
      formData.append("date_of_birth", userData.date_of_birth);
      formData.append("phone_no", userData.phoneNo);
      formData.append("website", userData.website);
      formData.append("city", userData.address.city);
      formData.append("state", userData.address.state);
      formData.append("country", userData.address.country);

      editProfile(formData, setLoading)
    }
    setValidated(true);

  };

  const currentDate = () => {
    // dd-mm-yyyy formate
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return yyyy + '-' + mm + '-' + dd;
  }

  return (
    <div className="container-fluid px-4">
      {loading ? (
        <Row>
          <Col md='8'>
            <div className="ph-item">
              <div className="ph-col-12">
                <div className="ph-row">
                  <div className="ph-col-4"></div>
                  <div className="ph-col-12 empty"></div>
                  <div className="ph-col-2"></div>
                  <div className="ph-col-12"></div>
                  <div className="ph-col-4"></div>
                  <div className="ph-col-12 empty"></div>
                  <div className="ph-col-2"></div>
                  <div className="ph-col-12"></div>
                  <div className="ph-col-4"></div>
                  <div className="ph-col-12 empty"></div>
                  <div className="ph-col-2"></div>
                  <div className="ph-col-12"></div>
                </div>
              </div>
            </div>
          </Col>
          <Col md='4'>
            <div className="ph-item">
              <div className="ph-col-12">
                <div className="ph-row">
                  <div className="ph-col-4"></div>
                  <div className="ph-col-12 empty"></div>
                  <div className="ph-col-2"></div>
                  <div className="ph-col-12"></div>
                  <div className="ph-col-4"></div>
                  <div className="ph-col-12 empty"></div>
                  <div className="ph-col-2"></div>
                  <div className="ph-col-12"></div>
                  <div className="ph-col-4"></div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      ) : (<Row>
        <Col md='8'>
          <Card className="mb-3">
            <Card.Header>
              Edit Your Profile
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formSubmitHandler} noValidate validated={validated}>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="fname">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="First Name"
                        value={userData.name.firstName || ''}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            name: {
                              ...userData.name,
                              firstName: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Last Name"
                        value={userData.name.lastName || ''}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            name: {
                              ...userData.name,
                              lastName: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={userData.email || ''}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Designation"
                    value={userData.designation || ''}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        designation: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Select value={userData.address.country || ''} aria-label="Default select example" onChange={(e) => {
                        setUserData({
                          ...userData,
                          address: {
                            ...userData.address,
                            country: e.target.value,
                          },
                        })
                      }}>
                        <option value=''>Select Country</option>
                        {allCountry.map(data => {
                          return <option key={data.isoCode} value={data.isoCode}>{data.name}</option>
                        })}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Select aria-label="Default select example" value={userData.address.state || ''} onChange={(e) =>
                        setUserData({
                          ...userData,
                          address: {
                            ...userData.address,
                            state: e.target.value,
                          },
                        })
                      }>
                        <option value=''>Select State</option>
                        {stateOfCountry.map(data => {
                          return <option key={data.isoCode} value={data.isoCode}>{data.name}</option>
                        })}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Select value={userData.address.city || ''} onChange={(e) =>
                        setUserData({
                          ...userData,
                          address: {
                            ...userData.address,
                            city: e.target.value,
                          },
                        })
                      } aria-label="Default select example">
                        <option value=''>Select City</option>
                        {cityOfState.map(data => {
                          return <option key={data.name} value={data.name}>{data.name}</option>
                        })}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={userData.date_of_birth || ''}
                    onChange={(e) => {
                      setUserData({
                        ...userData,
                        date_of_birth: e.target.value,
                      });
                    }}
                    max={currentDate()}
                  />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Web Site</Form.Label>
                      <Form.Control
                        type="url"
                        placeholder="Web Site"
                        value={userData.website || ''}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            website: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Contact No.</Form.Label>
                      <PhoneInput country={'in'}
                        value={userData.phoneNo || ''}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            phoneNo: e,
                          })
                        }
                      />

                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label>Set Profile</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={(e) =>
                          formData.append("profile_image", e.target.files[0])
                        }
                        accept="image/jpeg,image/jpg"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit">
                  Save
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md='4'>
          <ChangePasssword />
        </Col>
      </Row>)}
    </div>
  );
};

export default EditProfile;