import React, { useRef } from 'react';
import swal from 'sweetalert';
import { useAuth } from '../AuthContext/AuthContext';

const ResetPassword = () => {

  const passwordRef = useRef();
  const cPasswordRef = useRef();
  const { resetPassword } = useAuth()

  let baseUrl = (window.location).href;
  let pwdToken = baseUrl.substring(baseUrl.lastIndexOf('=') + 1);

  const resetPasswordHandle = (e) => {
    e.preventDefault();
    const password = passwordRef.current.value;
    const cPassword = cPasswordRef.current.value;
    if (password.length >= 6) {
      if (password === cPassword) {
        resetPassword(pwdToken, password);
        passwordRef.current.value = ''
        cPasswordRef.current.value = ''
      } else {
        swal("fail", 'password does not match', "error")
      }
    } else {
      swal("fail", 'password must be 6 characters or more', "error")
    }
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
              <div className="row justify-content-center">
                <div className="col-lg-5">
                  <div className="card shadow-lg border-0 rounded-lg">
                    <div className="card-header">
                      <h3 className="text-center font-weight-light my-4">
                        Reset Password
                      </h3>
                    </div>
                    <div className="card-body">
                      <form onSubmit={resetPasswordHandle}>
                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            id="inputPassword"
                            type="password"
                            placeholder="name@example.com"
                            required
                            ref={passwordRef}
                          />
                          <label htmlFor="inputPassword">Enter Password</label>
                        </div>
                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            id="inputCPassword"
                            type="password"
                            placeholder="name@example.com"
                            required
                            ref={cPasswordRef}
                          />
                          <label htmlFor="inputCPassword">Re-Enter Password</label>
                        </div>
                        <div className="mt-4 mb-0">
                          <button className="btn btn-primary" type="submit">
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
