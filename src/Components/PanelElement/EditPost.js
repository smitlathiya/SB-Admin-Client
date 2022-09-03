import React, { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useAuth } from "../../AuthContext/AuthContext";

const EditPost = () => {
  const [postNotFound, setpostNotFound] = useState(false);
  const postTitle = useRef();
  const postBody = useRef();
  const postImg = useRef();

  const formData = new FormData();

  const {editPost, authData} = useAuth()
  
  const postId = useParams().postId;

  useEffect(() => {
    if(authData){
      axios
        .get(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
          headers: {
            Accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
        })
        .then((res) => {
          postTitle.current.value = res.data.title;
          postBody.current.value = res.data.body;
        })
        .catch(() => {
          setpostNotFound(true);
          swal("404", "Post Not Found", "error");
        });
    }
  }, [authData, postId]);

  const formSubmitHandler = (e) => {
    e.preventDefault();

    formData.append("title", postTitle.current.value);
    formData.append("body", postBody.current.value);

    editPost(postId, formData)
  };

  let redirect = null;
  if (postNotFound) {
    redirect = <Navigate to="/profile" />;
  }

  return (
    <div className="container-fluid px-4">
      {redirect}
      <div className="card">
        <h5 className="card-header">Create Your Post</h5>
        <div className="card-body">
          <Form onSubmit={formSubmitHandler}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Post Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Post Title"
                ref={postTitle}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Post Title</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Post Body"
                ref={postBody}
                required
              />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Post Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => formData.append("photo", e.target.files[0])}
                accept="image/jpeg,image/jpg"
                ref={postImg}
              />
            </Form.Group>
            <Button type="submit">Update</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
