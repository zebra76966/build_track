import React, { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./admin.css";
import Orders from "./orders";
import Transactions from "./transactions";
import TodoList from "./todolist";
import { ToastBar, Toaster } from "react-hot-toast";
import FilterCard from "./filtercard";

const AdminDashboard = () => {
  const [active, setActive] = useState(0);

  const [orderFilter, setOrderFilter] = useState({ vendors: [], status: [] });

  return (
    <div className="d-flex bg-dark" style={{ height: "100dvh" }}>
      <Toaster />
      <div className="sidebar">
        <Sidebar setActive={(e) => setActive(e)} active={active} />
      </div>

      <div className="mainSection ">
        <div className="w-100 mb-1 py-1 px-2">
          <Header />
        </div>
        <div className="px-1 pb-3 pt-0">
          <div className="mainSectionInner w-100 py-4 px-3 text-light noScrollBar">
            <div className="row mx-0 px-0">
              <div className="col-12">
                <h4 className="display-6 fw-semi-bold">Good Evening 👋</h4>
              </div>
              <div className="col-xl-12 mt-2">
                {active == 0 && (
                  <div className="fade-in ">
                    <div className="row">
                      <div className="col-9">
                        <Orders orderFilter={orderFilter} />
                      </div>
                      <div className="col-3">
                        <div className="position-sticky top-0 left-0">
                          <FilterCard setFilter={(e) => setOrderFilter(e)} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {active == 1 && (
                  <div className="fade-in position-relative">
                    <Transactions />
                  </div>
                )}
              </div>

              <div className="col-xl-4 mt-2 d-none">
                <div className="position-sticky top-0 left-0 fade-in">
                  <TodoList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
