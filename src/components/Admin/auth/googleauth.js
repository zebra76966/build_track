// Import this from the lib
import { React, useState } from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";
import { baseUrl } from "../../config";
import { useNavigate } from "react-router-dom";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true;

function Gauth() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["uToken"]);
  const [isLoading, setIsloading] = useState(false);

  async function onSuccess(res) {
    console.log("success:", res.access_token);
    setIsloading(true);

    localStorage.setItem("google-access", res.access_token);

    try {
      // First API call to send Google access token
      const googleResponse = await axios.post(baseUrl + "/user-accounts/google/", {
        access_token: res.access_token,
      });

      console.log(googleResponse);
      if (googleResponse.data?.access) {
        setCookie("uToken", googleResponse.data.access, { path: "/" });
        toast.success(googleResponse.data.message ? googleResponse.data.message : "Success");
        navigate("/dashboard/orders");
      }

      // Second API call to get user token
      // const config = { headers: { "content-type": "application/json" } };
      // const userTokenResponse = await axios.post(baseUrl + "/user-accounts/user-token", {}, config);

      // if (userTokenResponse.data?.token) {
      //   setCookie("uToken", userTokenResponse.data.token, { path: "/" });
      //   toast.success("Success");
      //   window.location.href = "/";
      // } else {
      //   toast.error("Token retrieval failed");
      // }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsloading(false);
    }
  }

  // Use this function to trigger the
  // "LogIn With Google" process
  // at the end of which the onSuccess function
  // is triggered
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => onSuccess(codeResponse),
    onError: () => toast.error("Something went Wrong"),
  });

  return (
    <button type="button" className="btn btn-white bg-white border-secondary  w-100 py-2 ms-1" role="button" style={{ borderRadius: "10px" }} onClick={() => login()}>
      <svg width="16" height="16" viewBox="0 0 256 256" className="me-2" preserveAspectRatio="xMidYMid" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
          fill="#4285F4"
        ></path>
        <path
          d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
          fill="#34A853"
        ></path>
        <path
          d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
          fill="#FBBC05"
        ></path>
        <path
          d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
          fill="#EB4335"
        ></path>
      </svg>
      Google
    </button>
  );
}

export default Gauth;
