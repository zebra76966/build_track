import React from "react";
import { baseUrl } from "../../config";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useCookies } from "react-cookie";

import { Outlet, Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const SignUp = (props) => {
  document.title = "Sign Up";
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  const [response, setResponse] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["uToken"]);
  const [next, setNext] = useState(false);

  useEffect(() => {
    if (cookies.uToken !== undefined) {
      navigate("/");
    }
  }, [cookies]);

  const [udata, setUdata] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [isLoading, setIsloading] = useState(false);

  const isDataValid = () => {
    for (const key in udata) {
      if (udata.hasOwnProperty(key) && (udata[key] === "" || udata[key] === null)) {
        return false;
      }
    }
    return true;
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    console.log(udata);

    if (isDataValid()) {
      setIsloading(true);
      const config = {
        headers: { "content-type": "application/json" },
      };

      Axios.post(baseUrl + "/user_auth/register/", udata, config)
        .then((response) => {
          if (response.data && response.data.message) {
            setResponse(response.data.message);
          }

          toast.success("Successfully Registered");
          setIsloading(false);
          console.log(response.data);

          setUdata({ username: "", first_name: "", last_name: "", email: "", password: "", password2: "" });
          // Navigate after state updates
          setTimeout(() => {
            navigate("/");
          }, 1000);
        })
        .catch((error) => {
          setResponse(error.message);
          toast.error("Something went Wrong");
          setIsloading(false);
          console.log(error.message);
        });
    } else {
      toast.error("Form is !ncomplete");
    }
  };

  return (
    <>
      <Toaster />
      {isLoading && (
        <div className="d-flex align-items-center w-100 justify-content-center" style={{ height: "100lvh", zIndex: "99", position: "fixed", top: "0", left: "0", background: "rgba(255,255,255,0.5)" }}>
          <div class="loader">
            <h4 className="display-6">Processing</h4>
          </div>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="pattern d-flex align-items-center justify-content-center bg-black"
        style={{ height: "100vh" }}
      >
        <form
          id="uform"
          onSubmit={handlesubmit}
          className="row col-11 col-xl-8 col-lg-5  p-4 my-5 text-light bg-dark shadow border-dark border-3 border cardrounded"
          data-aos="fade-down"
          style={{ borderRadius: "1rem" }}
        >
          <div className="row">
            <div className="col-12 mb-3">
              <h3 className="fw-bold py-4">Sign Up</h3>
              {response !== "" && <p className="fw-bold text-info">{response}</p>}
              <hr />
            </div>
            <div className="col-12 mb-3 col-md-6">
              <label for="first_name" className="form-label">
                First Name
              </label>
              <input
                required
                type="text"
                className="form-control bg-light text-dark shadow-sm border-1 p-3 border-secondary"
                id="first_name"
                placeholder="John"
                autoComplete="off"
                value={udata.first_name}
                onChange={(e) => setUdata({ ...udata, first_name: e.target.value })}
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div className="col-12 mb-3 col-md-6">
              <label for="last_name" className="form-label">
                Last Name
              </label>
              <input
                required
                type="text"
                className="form-control bg-light text-dark shadow-sm border-1 p-3 border-secondary"
                id="last_name"
                placeholder="Jacobs"
                autoComplete="off"
                value={udata.last_name}
                onChange={(e) => setUdata({ ...udata, last_name: e.target.value })}
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div className="col-12 mb-3">
              <label for="Email" className="form-label">
                Email
              </label>
              <input
                required
                type="email"
                className="form-control bg-light text-dark shadow-sm border-1 p-3 border-secondary"
                id="Email"
                autoComplete="email"
                placeholder="John@email.com"
                value={udata.email}
                onChange={(e) => setUdata({ ...udata, email: e.target.value })}
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div className="col-12 mb-3 ">
              <label for="Password" className="form-label">
                Password
              </label>
              <input
                required
                type="password"
                className="form-control bg-light text-dark shadow-sm border-1 p-3 border-secondary"
                id="Password"
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                value={udata.password}
                onChange={(e) => setUdata({ ...udata, password: e.target.value })}
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div className="col-12 mb-3">
              <label for="Password" className="form-label">
                Confirm - Password
              </label>
              <input
                required
                type="password"
                className="form-control bg-light text-dark shadow-sm border-1 p-3 border-secondary"
                id="Password"
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                value={udata.password2}
                onChange={(e) => setUdata({ ...udata, password2: e.target.value })}
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div className="col-12 mb-3">
              <label for="username" className="form-label">
                Username
              </label>
              <input
                required
                type="text"
                className="form-control bg-light text-dark shadow-sm border-1 p-3 border-secondary"
                id="username"
                placeholder="john123"
                autoComplete="off"
                value={udata.username}
                onChange={(e) => setUdata({ ...udata, username: e.target.value })}
                style={{ borderRadius: "10px" }}
              />
            </div>

            {udata.password !== udata.password2 && <span className="d-block px-2  py-1 my-2 rounded bg-warning text-dark lead">Password and Confirm - Password should Match</span>}

            <div className="col-12 py-2" style={{ borderRadius: "10px" }}>
              <button type="submit" className="btn w-100 fw-bold py-2 btn-lg bg-black text-light" style={{ borderRadius: "10px" }}>
                Continue
              </button>
            </div>
          </div>

          <p className="lead">
            Already have an Account?
            <Link to="/" state={{ check: "Login" }} className="link-info text-decoration-none fw-bold">
              {" "}
              Login
            </Link>
          </p>
        </form>

        <Outlet />
      </motion.div>
    </>
  );
};
export default SignUp;
