import axios from "axios";
import Gauth from "./googleauth";
import { GoogleOAuthProvider, GoogleLogin as GoogleOAuthLogin } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../../config";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true;

const CustomGoogleLogin = () => {
  const clientId = "778107547315-r0cc1s5jb3h4kitrh1tic3objf10ec7u.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId} cookiePolicy={"single_host_origin"}>
      <Gauth />
    </GoogleOAuthProvider>
  );
};

export default CustomGoogleLogin;
