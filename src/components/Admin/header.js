import React from "react";
import { useState, useEffect, useContext } from "react";
import { baseUrl } from "../config";
import toast from "react-hot-toast";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "./auth/authContext";
import { useCookies } from "react-cookie";

const Header = ({ setGlobalMatchingProducts, setGlobalSelectedAddress, materialDate, setActive, active }) => {
  const { accessToken, clearToken, saveToken } = useContext(AuthContext);
  const [masterAddresses, setMasterAdresses] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["uToken"]);
  const [isLoading, setIsloading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, [accessToken]);

  const handleFetchMasterAddress = async () => {
    setIsloading(true);

    try {
      const response = await fetch(baseUrl + "/dashboard/master-addresses/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("address", data);
      setMasterAdresses(data);
    } catch (error) {
      toast.error("Something went wrong while fetching orders.");
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    handleFetchMasterAddress();
  }, []);

  const [matchingAddress, setMatchingAddress] = useState([]);
  const reformatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const GetPropertyMacthingProducts = async (id) => {
    setIsloading(true);

    const body = {
      master_address_id: id || null,
      ordered_date: materialDate ? reformatDate(materialDate) : null,
    };

    try {
      const response = await fetch(baseUrl + "/dashboard/property-matching-products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (["token_not_valid", "token_expired", "user_not_found", "user_inactive", "password_changed"].includes(data?.code)) {
        handleSessionExpiry();
        return;
      }

      console.log("address", data);
      setMatchingAddress(data.matching_products || []);
    } catch (error) {
      console.error("error", error);

      // Handle fetch/network error
      if (error?.data?.code && ["token_not_valid", "token_expired", "user_not_found", "user_inactive", "password_changed"].includes(error.data.code)) {
        handleSessionExpiry();
        return;
      }

      toast.error("An error occurred while fetching matching products.");
      setMatchingAddress([]);
    } finally {
      setIsloading(false);
    }
  };

  // Helper to reduce duplication
  const handleSessionExpiry = () => {
    clearToken();
    removeCookie("uToken");
    toast.error("Session expired, please login again.");
    window.location.href = "/";
  };
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    GetPropertyMacthingProducts(selectedAddress);
  }, [selectedAddress, materialDate]);

  useEffect(() => {
    if (matchingAddress) {
      setGlobalMatchingProducts(matchingAddress);
    }
  }, [matchingAddress]);

  useEffect(() => {
    setGlobalSelectedAddress(selectedAddress);
  }, [selectedAddress]);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      setIsFullScreen(true);
      document.documentElement.requestFullscreen().catch((err) => {
        setIsFullScreen(false);
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      setIsFullScreen(false);
      document.exitFullscreen();
    }
  };

  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        {/* <a class="navbar-brand" href="#">
          Navbar
        </a> */}
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <form class="d-flex align-items-center">
            <span class="fs-4 d-xxxl-none  text-white fw-bold me-3">Logo</span>
            <div className="position-relative">
              <input class="form-control me-2 topSearch bg-black rounded-pill border-0 px-5 py-2" type="search" placeholder="Search..." aria-label="Search" />

              <img src="/icons/search.svg" className="searchIcon" />
            </div>

            <div class="dropdown ms-1">
              <button
                class="btn btn-secondary btn-sm mb-0 dropdown-toggle bg-dark border-secondary rounded-pill border-2 px-5 border-dashed position-relative"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {selectedAddress == null ? "All Active Props." : masterAddresses.find((ini) => ini.id === selectedAddress)?.formatted_address || "Select Address"}

                <span
                  className="position-absolute top-50   translate-middle-y  p-2 bg-black rounded-circle border-primary border-1 border d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px", right: "-10px" }}
                >
                  <img src="/icons/anchor-lock-solid.svg" style={{ height: "100%", width: "100%" }} />
                </span>
              </button>
              <ul class="dropdown-menu bg-dark slim-scroll shadow" aria-labelledby="dropdownMenuButton1" style={{ maxHeight: "200px", width: "500px", overflowY: "auto" }}>
                <li>
                  <span class="dropdown-item text-warning" onClick={() => setSelectedAddress(null)} style={{ cursor: "pointer" }}>
                    All Active Projects
                  </span>
                </li>

                {masterAddresses.map((ini) => (
                  <li key={ini.id}>
                    <span class="dropdown-item text-light" onClick={() => setSelectedAddress(ini.id)} style={{ cursor: "pointer" }}>
                      {ini.formatted_address}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </form>

          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item rounded-circle bg-black p-1 d-flex align-items-center justify-content-center me-2" style={{ width: "50px", height: "50px" }}>
              <a class="nav-link   " href="#">
                <img src="/icons/link-duotone-solid.svg" height={22} />
              </a>
            </li>
            <li class="nav-item rounded-circle bg-black p-1 d-flex align-items-center justify-content-center me-2" style={{ width: "50px", height: "50px" }}>
              <a class="nav-link   " href="#">
                <img src="/icons/list-check-solid.svg" height={22} />
              </a>
            </li>
            <li class="nav-item rounded-circle bg-black p-1 d-flex align-items-center justify-content-center me-2  " style={{ width: "50px", height: "50px" }}>
              <a class="nav-link ">
                <img src="/icons/calendar-range-solid.svg" height={24} />
              </a>
            </li>
            <li class="nav-item rounded-circle bg-black p-1 d-flex align-items-center justify-content-center me-2 dropdown" style={{ width: "50px", height: "50px" }}>
              <a class="nav-link  dropdown-toggle noChev" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="/icons/calculator-solid.svg" height={24} />
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3 bg-dark border-2 border-secondary mt-2" style={{ borderRadius: "1em" }} aria-labelledby="navbarDropdown">
                <li>
                  <a class="dropdown-item text-light pb-2 rounded-pill" href="#">
                    <img src="/icons/hill-rockslide-solid.svg" height={24} width={50} className="me-2" /> Gravel/Dirt
                  </a>
                </li>
                <li>
                  <a class="dropdown-item text-light pb-2 rounded-pill" href="#">
                    <img src="/icons/money-check-dollar-pen-sharp-solid.svg" height={24} width={50} className="me-2" /> Payoffs
                  </a>
                </li>
              </ul>
            </li>
            <li class="nav-item rounded-circle bg-black p-1 d-flex align-items-center justify-content-center me-2 dropdown" style={{ width: "50px", height: "50px" }}>
              <a class="nav-link  dropdown-toggle noChev" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="/icons/message-text-solid.svg" height={22} />
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3 bg-dark border-2 border-secondary mt-2" style={{ borderRadius: "1em" }} aria-labelledby="navbarDropdown">
                <li>
                  <a class="dropdown-item text-light pb-2 rounded-pill" href="#">
                    <img src="/icons/language-solid.svg" height={24} width={50} className="me-2" /> translate
                  </a>
                </li>
                <li>
                  <a class="dropdown-item text-light pb-2 rounded-pill" href="#">
                    <img src="/icons/clock-solid.svg" height={24} width={50} className="me-2" /> Schedule
                  </a>
                </li>

                <li>
                  <a class="dropdown-item text-light pb-2 rounded-pill" href="#">
                    <img src="/icons/comments-solid.svg" height={24} width={50} className="me-2" /> Text Scripts
                  </a>
                </li>

                <li>
                  <a class="dropdown-item text-light pb-2 rounded-pill" href="#">
                    <img src="/icons/envelope-open-text-solid.svg" height={24} width={50} className="me-2" /> Email Scripts
                  </a>
                </li>

                <li>
                  <a class="dropdown-item text-light pb-2 rounded-pill" href="#">
                    <img src="/icons/phone-intercom-solid.svg" height={24} width={50} className="me-2" /> Phone Scripts
                  </a>
                </li>
              </ul>
            </li>

            <li class="nav-item rounded-circle bg-black p-1 d-flex align-items-center justify-content-center me-2 dropdown" style={{ width: "50px", height: "50px" }}>
              <a class="nav-link   dropdown-toggle noChev" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="/icons/credit-card-solid.svg" height={22} />
              </a>

              <ul class="dropdown-menu dropdown-menu-end p-3 bg-dark border-2 border-secondary mt-2" style={{ borderRadius: "1em" }} aria-labelledby="navbarDropdown">
                <li>
                  <a class="dropdown-item text-light pb-2 rounded-pill" href="#">
                    <img src="/icons/envelope-open-dollar-solid.svg" height={24} width={50} className="me-2 " /> Reimbursement
                  </a>
                </li>
                <li>
                  <a class="dropdown-item text-light pb-2 rounded-pill" href="#">
                    <img src="/icons/cehckBook.svg" height={24} width={50} className="me-2" /> Checkbook.io
                  </a>
                </li>

                <li>
                  <a class="dropdown-item text-light pb-2 rounded-pill" href="#">
                    <img src="/icons/money-check-dollar-pen-sharp-solid.svg" height={24} width={50} className="me-2" /> Check Codes
                  </a>
                </li>

                <li>
                  <a class="dropdown-item text-light pb-2 rounded-pill" href="#">
                    <img src="/icons/simple-cashapp.svg" height={24} width={50} className="me-2" /> CashApp
                  </a>
                </li>
                <li>
                  <a class="dropdown-item text-light pb-2 rounded-pill" href="#">
                    <img src="/icons/logo-venmo-svgrepo-com.svg" height={24} width={50} className="me-2" /> Venmo
                  </a>
                </li>
                <li>
                  <a class="dropdown-item text-light pb-2 rounded-pill" href="#">
                    <img src="/icons/apple-pay-brands-solid.svg" height={22} width={50} className="me-2" /> Apple Pay
                  </a>
                </li>
              </ul>
            </li>

            <li class="nav-item rounded-circle bg-black p-1 d-flex align-items-center justify-content-center me-2" style={{ width: "50px", height: "50px" }}>
              <span class="nav-link   " onClick={toggleFullScreen} style={{ cursor: "pointer" }}>
                {isFullScreen ? <img src="/icons/material-fullscreen-exit.svg" height={22} /> : <img src="/icons/material-fullscreen.svg" height={22} />}
              </span>
            </li>

            {!isLoggedIn ? (
              <li className="nav-item">
                <Link to="/" className={`nav-link ${active === 5 ? "active" : ""}`} onClick={() => setActive && setActive(5)} style={{ cursor: "pointer" }}>
                  Login
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link"
                  onClick={() =>
                    toast((t) => (
                      <span>
                        <b>Log Out? </b>
                        <a
                          className="btn bg-info text-light mx-2"
                          onClick={() => {
                            removeCookie("uToken");
                            clearToken();
                            toast.dismiss(t.id);
                            clearToken();
                            window.location.href = "/";
                          }}
                        >
                          <i className="fa fa-check"></i>
                        </a>
                        <a className="btn bg-dark text-light" onClick={() => toast.dismiss(t.id)}>
                          <i className="fa fa-times"></i>
                        </a>
                      </span>
                    ))
                  }
                >
                  Logout <i className="fa fa-sign-out ms-2" />
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <Outlet />
    </nav>
  );
};

export default Header;
