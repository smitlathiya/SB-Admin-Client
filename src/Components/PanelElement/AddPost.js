import React, { useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useAuth } from "../../AuthContext/AuthContext";

const AddPost = () => {
  const postTitle = useRef();
  const postBody = useRef();
  const postImg = useRef();
  const formData = new FormData();
  const {addPost} = useAuth()

  const formSubmitHandler = (e) => {
    e.preventDefault();
    formData.append("title", postTitle.current.value);
    formData.append("body", postBody.current.value);
    addPost(formData);
    postBody.current.value = "";
    postTitle.current.value = "";
    postImg.current.value = "";
  };

  return (
    <div className="container-fluid px-4">
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
            <Button type="submit">Add</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
