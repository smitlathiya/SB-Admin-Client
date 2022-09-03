import React, { useEffect, useState } from 'react';
import placeholder from '../assets/imgsvg.svg'
import DropdownButton from 'react-bootstrap/esm/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import defalutUserImg from "../assets/avatar.png";
import { Alert, Button, Modal } from 'react-bootstrap';
import swal from 'sweetalert';


const Postcard = (props) => {
    const { deletePost,
        authData,
        profileImageCheck,
        likePost,
        unlikePost,
        postComment,
        deleteComment } = useAuth();
    const [noOfLike, setNoOfLike] = useState(0);
    const [modalShow, setModelShow] = useState(false)
    const [commentWaiting, setCommentWaiting] = useState(false);
    const [noOfComment, setNoOfComment] = useState(0);
    const [comment, setComment] = useState('');
    const [postData, setPostdata] = useState(props.postData);
    const [like, setLike] = useState(false);
    const btnIcon = (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
    </svg>);
    const [userImg, setUserImg] = useState(defalutUserImg);


    useEffect(() => {
        setUserImg(profileImageCheck(postData.postedBy._id))
    }, [props.postData]);

    useEffect(() => {
        postData.likes.find(lks => {
            if (lks == authData.id) {
                setLike(true)
            } else {
                setLike(false)
            }
        })
        setNoOfLike(postData.likes.length)
        setNoOfComment(postData.comments.length)
    }, [postData]);

    const commentHandle = (e) => {
        e.preventDefault();
        if (comment.length > 0) {
            setCommentWaiting(true)
            postComment(postData._id, comment, setCommentWaiting)
            setComment('')
        }
    }

    const deleteCommentHandler = (cId) => {

        deleteComment(postData._id, cId);
        const newCmt = postData.comments.filter(data => data._id !== cId)
        setPostdata({ ...postData, comments: newCmt })
    }

    return (
        <div>
            <div className="widget widget-blog">
                <div className="widget-blog-cover">
                    {props.menu ? (
                        <DropdownButton
                            variant="outline-secondary"
                            title={btnIcon}
                            id="input-group-dropdown-1"
                            className='btn btn-light post-menu-btn'
                        >
                            <Link to={`/editpost/${postData._id}`} className='dropdown-item'>Edit</Link>
                            <Dropdown.Item onClick={() => {
                                swal({
                                    title: "Are you sure?",
                                    text: "post will be deleted permenatly",
                                    icon: "warning",
                                    buttons: true,
                                    dangerMode: true,
                                })
                                    .then((willDelete) => {
                                        if (willDelete) {
                                            props.deletePostHandle(postData._id)
                                            deletePost(postData._id)
                                        }
                                    });
                            }}>Delete</Dropdown.Item>
                        </DropdownButton>) : null}
                    <img src={props.photoUrl ? props.photoUrl : placeholder}
                        alt={postData.title}
                        style={{ width: '100%' }} />
                </div>
                <div className="widget-blog-author">
                    <div className="widget-blog-author-image">
                        <img src={userImg}
                            alt={postData.postedBy.username}
                            style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="widget-blog-author-info">
                        <h5 className="m-t-0 mb-0">{postData.postedBy.name.first_name} {postData.postedBy.name.last_name}</h5>
                        <p className="text-muted m-0 f-s-11">{postData.postedBy.designation}</p>
                    </div>
                </div>
                <div className="widget-blog-content">
                    <h5>{postData.title}</h5>
                    <p>{postData.body}</p>
                </div>
                <div className='mt-5 post-footer'>
                    <div className='like-wapper'>
                        {like ?
                            (
                                <svg width="20" height="20" fill="#6f42c1" className="bi bi-heart-fill" viewBox="0 0 16 16" onClick={() => {
                                    unlikePost(postData._id, setLike)
                                    setNoOfLike(noOfLike - 1)
                                }}>
                                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" fill="#6f42c1" className="bi bi-heart" viewBox="0 0 16 16" onClick={() => {
                                    likePost(postData._id, setLike)
                                    setNoOfLike(noOfLike + 1)
                                }}>
                                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                </svg>
                            )}

                        <span className='ms-2'>{noOfLike} likes</span>
                    </div>
                    <div className='comment-wrapper' onClick={() => {
                        setModelShow(true)
                    }}>
                        <svg width="20" height="20" fill="#6f42c1" className="bi bi-chat" viewBox="0 0 16 16">
                            <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                        </svg>
                        <span className='ms-2'>{noOfComment} comments</span>
                    </div>
                </div>
                <div className="comment-block">
                    <form className="comment-form" onSubmit={commentHandle}>
                        <input type="text" placeholder="Comment" className="comment-input" value={comment} onChange={(element) => {
                            setComment(element.target.value)
                        }}
                            disabled={commentWaiting} />
                        <button type="submit" disabled={!comment}>
                            <svg viewBox="0 0 512 512" width='15px'>
                                <path fill='#fff' d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
            <Modal show={modalShow} size="lg">
                <Modal.Header>
                    <Modal.Title>Comments</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul className='comment-list'>
                        {postData.comments.length > 0 ? postData.comments.map(data => {
                            return (
                                <li className='mb-2' key={data._id}>
                                    <div className='user-comment'>
                                        <div>
                                            <p><b>{data.postedBy.name.first_name} {data.postedBy.name.last_name}</b> {data.text}</p>
                                        </div>
                                        <div>
                                            {authData.id == postData.postedBy._id || data.postedBy._id == authData.id ? (<div className='btn' onClick={() => deleteCommentHandler(data._id)}>
                                                <svg viewBox="0 0 448 512" width='15px'>
                                                    <path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z" />
                                                </svg>
                                            </div>) : null}
                                        </div>
                                    </div>
                                </li>
                            )
                        }) : <Alert variant='secondary'>No Comments Found</Alert>}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        setModelShow(false)
                    }}>Close</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default Postcard;