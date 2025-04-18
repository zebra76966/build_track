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
    let body = {
      master_address_id: id ? id : 3,
      ordered_date: materialDate && reformatDate(materialDate),
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
      console.log("address", data);
      setMatchingAddress(data.matching_products);
    } catch (error) {
      toast.error("Something went wrong while fetching orders.");
      setMatchingAddress([]);
    } finally {
      setIsloading(false);
    }
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

            <li class="nav-item">
              <a class="nav-link" href="#">
                Link#2
              </a>
            </li>
          </ul>
        </div>
      </div>

      <Outlet />
    </nav>
  );
};

export default Header;
