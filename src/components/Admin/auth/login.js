import React from "react";
import { baseUrl } from "../../config";
import { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { Outlet, Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Axios from "axios";
import { motion } from "framer-motion";
import { AuthContext } from "./authContext";
import CustomGoogleLogin from "./googleauthWrapper";

const Login = (props) => {
  const navigate = useNavigate();
  const { accessToken, clearToken, saveToken } = useContext(AuthContext);

  document.title = "User-Login";
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [cookies, setCookie, removeCookie] = useCookies(["uToken"]);

  useEffect(() => {
    if (cookies.uToken !== undefined) {
      navigate("/dashboard/orders");
    }
  }, []);

  const [response, setResponse] = useState([]);
  const [tresponse, setTresponse] = useState("");
  const [udata, setUdata] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsloading] = useState(false);

  const [resetmail, setResetEmail] = useState({
    user_email: "",
  });

  const handleReset = () => {
    setIsloading(true);
    const config = {
      headers: { "content-type": "application/json" },
    };

    Axios.post(baseUrl + "/user/forgot-password/", resetmail, config)
      .then((response) => {
        setIsloading(false);
        console.log(response.data);
        toast.success("Check your email for next steps", {
          duration: 10000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      })
      .catch((error) => {
        console.log(error);
        setIsloading(false);
        toast.error(error.response.data.error, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      });
  };

  //Verify user login
  // useEffect(() => {
  //   if (cookies.uToken !== undefined) {
  //     Axios.get(baseUrl + "/user/profile/", { headers: { "content-type": "application/json", Authorization: `Bearer ${cookies.uToken}` } }).then((response2) => {
  //       console.log(response2.data);
  //       // if (response2.data.status) {
  //       //   window.location.href = "/admin_dashboard";
  //       // } else {
  //       //   window.location.href = "/dashboard";
  //       // }
  //     });
  //   }
  // }, []);

  // Vrrify User Login End========>

  const [redirectURL, setRedirectURL] = useState(localStorage.getItem("redirectURL") || "/dashboard/orders");

  const handlesubmit = (e) => {
    setIsloading(true);

    e.preventDefault();

    const config = {
      headers: { "content-type": "application/json" },
    };

    setTresponse("");
    Axios.post(baseUrl + "/user_auth/login/", udata, config)
      .then((response) => {
        setTresponse(response.data.message);
        saveToken(response.data.access);
        response.length !== 0 && setCookie("uToken", response.data.access, { path: "/" });
        setUdata({ email: "", password: "" });
        toast.success("Logged In Successfully", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setIsloading(false);
        console.log(response);

        navigate(redirectURL);
      })
      .catch((error) => {
        console.log(error);
        setTresponse(error.response.data?.detail);
        toast.error("Something went Wrong");
        setIsloading(false);
      });
  };

  return (
    <>
      {isLoading && (
        <div
          className="w-100 d-flex align-items-center justify-content-center position-fixed top-0 start-0"
          style={{ height: "100dvh", zIndex: "99", backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div class="loader">
            <h4 className="display-6">Processing...</h4>
          </div>
        </div>
      )}
      <Toaster />
      <motion.div className="dashboardview bg-black" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="card " style={{ background: "transparent", border: "none", height: "100dvh" }}>
          <div className="d-flex h-100 align-items-center justify-content-center">
            <form id="uform" onSubmit={handlesubmit} className="row g-3 col-11 col-lg-8 col-xl-5 p-lg-5 p-3 my-5  shadow bg-dark text-light  border-3 border-white" style={{ borderRadius: "1rem" }}>
              <h3 className="fw-bold">Login</h3>
              <p className="fw-bold text-info">{tresponse}</p>

              <hr />

              <div className="col-12">
                <label for="Email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control bg-dark text-light shadow-sm  p-3  border-secondary"
                  id="Email"
                  autoComplete="email"
                  placeholder="Davejonas@gmail.com"
                  value={udata.username}
                  onChange={(e) => setUdata({ ...udata, username: e.target.value })}
                  style={{ borderRadius: "10px" }}
                  required
                />
              </div>
              <div className="col-12">
                <label for="Password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control bg-dark text-light shadow-sm  p-3 border-secondary"
                  id="Password"
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  value={udata.password}
                  onChange={(e) => setUdata({ ...udata, password: e.target.value })}
                  style={{ borderRadius: "10px" }}
                  required
                />
              </div>

              <div className="col-12 py-2" style={{ borderRadius: "10px" }}>
                <button type="submit" className="btn w-100 fw-bold py-2 btn-lg bg-black text-light" style={{ borderRadius: "10px" }}>
                  Continue
                </button>
              </div>

              <div className="d-flex align-items-center justify-content-between">
                <hr className="bg-black w-100" /> <h5 className="fs-5 my-0 px-3">OR</h5> <hr className="bg-black w-100" />
              </div>
              <div className="w-100 me-2">
                {" "}
                <CustomGoogleLogin />
              </div>

              <p className="lead">
                Don't have an account?{" "}
                <Link to="/register" className="border-0 text-info text-decoration-none fw-bold" type="button">
                  Register
                </Link>
              </p>
            </form>

            <Outlet />
          </div>
        </div>
      </motion.div>
    </>
  );
};
export default Login;
