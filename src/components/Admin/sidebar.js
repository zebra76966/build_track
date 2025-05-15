import React from "react";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = ({ setActive, active }) => {
  const [expand, setExpand] = useState(false);

  return (
    <div class={`d-flex flex-column flex-shrink-0 p-0 text-white bg-dark h-100 sidebarBar ${expand ? "expand" : ""}`}>
      <img
        className="mt-4 d-xxxl-none collaspseButton ms-auto me-3"
        onClick={() => {
          setExpand(!expand);
        }}
        src="/icons/sidebar-collapse.svg"
        height={25}
        alt="Close"
        style={{ filter: "invert(1)" }}
      />
      <div className="w-100 d-xxxl-none-revert">
        <a href="/" class="d-flex p-xl-3 align-items-center justify-content-xl-start justify-content-center  mb-xl-3 mb-1 p-1 mb-md-0 me-xl-auto text-white text-decoration-none">
          <span class="fs-4  fw-bold">CBO</span>
        </a>
      </div>
      <hr className="bg-black" />
      <ul class="nav nav-pills flex-column mb-auto ">
        <li class="nav-item" onClick={() => setActive(0)}>
          <Link to="/dashboard/orders" class={`nav-link  ps-4 ${active == 0 ? "active" : ""}`}>
            <img src="/icons/cart-shopping-solid.svg" className="me-3" height={18} />
            <span className="txt">Orders</span>
          </Link>
        </li>
        <li class="nav-item" onClick={() => setActive(1)}>
          <Link to="/dashboard/transactions" class={`nav-link ps-4 text-white ${active == 1 ? "active" : ""}`}>
            <img src="/icons/credit-card-solid-b.svg" className="me-3" height={18} />
            <span className="txt">Transactions</span>
          </Link>
        </li>
        <li class="nav-item" onClick={() => setActive(2)}>
          <Link to="/dashboard/add-property" class={`nav-link ps-4 text-white ${active == 2 ? "active" : ""}`}>
            <img src="/icons/house-solid.svg" className="me-3" height={18} />
            <span className="txt">Add Property</span>
          </Link>
        </li>
        <li class="nav-item" onClick={() => setActive(3)}>
          <Link to="/dashboard/materials" class={`nav-link ps-4 text-white ${active == 3 ? "active" : ""}`}>
            <img src="/icons/hammer-solid.svg" className="me-3" height={18} />
            <span className="txt">Materials</span>
          </Link>
        </li>

        {/* <li class="nav-item">
          <a href="#" class="nav-link ps-4 text-white">
            <img src="/logo192.png" className="me-3" height={18} />
            <span className="txt">Products</span>
          </a>
        </li> */}
        <li class="nav-item">
          <a href="#" class="nav-link ps-4 text-white">
            <img src="/icons/helmet-safety-solid.svg" className="me-3" height={18} />
            <span className="txt">Vendors</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="https://calendar.google.com/calendar/u/0/r/month" target="_blank" class={`nav-link ps-4 text-white ${active == 4 ? "active" : ""}`}>
            <img src="/icons/awesome-calendar-check.svg" className="me-3" height={18} />
            <span className="txt">Calendar</span>
          </a>
        </li>
      </ul>
      <hr className="bg-black" />
      <div class="dropdown mt-auto p-3">
        <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2" />
          <span className="txt">
            <strong>mdo</strong>
          </span>
        </a>
        <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
          <li class="nav-item">
            <a class="dropdown-item" href="#">
              New project...
            </a>
          </li>
          <li class="nav-item">
            <a class="dropdown-item" href="#">
              Settings
            </a>
          </li>
          <li class="nav-item">
            <a class="dropdown-item" href="#">
              Profile
            </a>
          </li>
          <li class="nav-item">
            <hr class="dropdown-divider" />
          </li>
          <li class="nav-item">
            <a class="dropdown-item" href="#">
              Sign out
            </a>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};

export default Sidebar;
