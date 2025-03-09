import React, { useState, useRef } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./admin.css";
import Orders from "./orders";
import Transactions from "./transactions";
import TodoList from "./todolist";
import { Toaster } from "react-hot-toast";
import FilterCard from "./filtercard";
import AddProperty from "./addProp";
import Materials from "./materials";
import DatePicker from "react-datepicker"; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the styles
import Register from "./register"; // Import Register component
import Login from "./login"; // Import Login component

const AdminDashboard = () => {
  const [active, setActive] = useState(0);

  const [orderFilter, setOrderFilter] = useState({ vendors: [], status: [], addresses: [] });
  const [globalMatchingProducts, setGlobalMatchingProducts] = useState([]);
  const [globalSelectedAddress, setGlobalSelectedAddress] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [materialDate, seMaterialDate] = useState(null);

  const handleCalendarClick = () => {
    setCalendarVisible(!calendarVisible);
  };

  return (
    <div className="d-flex bg-dark" style={{ height: "100dvh" }}>
      <Toaster />
      <div className="sidebar">
        <Sidebar setActive={(e) => setActive(e)} active={active} />
      </div>

      <div className="mainSection">
        <div className="w-100 mb-1 py-1 px-2">
        <Header setActive={setActive} active={active} setGlobalMatchingProducts={setGlobalMatchingProducts} setGlobalSelectedAddress={setGlobalSelectedAddress} materialDate={materialDate} />
        </div>
        <div className="px-1 pb-3 pt-0">
          <div className="mainSectionInner w-100 py-4 px-3 text-light noScrollBar">
            <div className="row mx-0 px-0">
              <div className="col-12">{active !== 3 && <h4 className="display-6 fw-semi-bold">Good Evening 👋</h4>}</div>
              <div className="col-xl-12 mt-2">
                {active === 0 && (
                  <div className="fade-in">
                    <div className="row">
                      <div className="col-9">
                        <Orders orderFilter={orderFilter} globalSelectedAddress={globalSelectedAddress} date={selectedDate?.toISOString().split("T")[0]} />
                      </div>
                      <div className="col-3">
                        <div className="position-sticky top-0 left-0">
                          <div className="position-relative mb-2">
                            <input
                              className="form-control topSearch bg-black border-1 border-secondary w-100 py-3 px-2 text-light"
                              type="date"
                              disabled
                              value={selectedDate?.toISOString().split("T")[0]}
                              style={{ borderRadius: "1em" }}
                            />
                            <div className="p-3 position-absolute top-0 end-0 h-100" onClick={handleCalendarClick}>
                              <img src="icons/calendar-range-solid.svg" height={"20px"} />
                            </div>
                            {calendarVisible && (
                              <DatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                                  setSelectedDate(localDate);
                                }}
                                inline
                                calendarClassName="custom-calendar"
                              />
                            )}
                          </div>
                          <FilterCard setFilter={setOrderFilter} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {active === 1 && <Transactions />}
                {active === 2 && <AddProperty />}
                {active === 3 && <Materials globalMatchingProducts={globalMatchingProducts} setGlobalMatchingProducts={setGlobalMatchingProducts} seMaterialDate={seMaterialDate} globalSelectedAddress={globalSelectedAddress} />}
                {active === 4 && <Register setActive={setActive} />}
                {active === 5 && <Login Login setActive={setActive} active={active} />}
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
