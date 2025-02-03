import React, { useState, useRef } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import "./admin.css";
import Orders from "./orders";
import Transactions from "./transactions";
import TodoList from "./todolist";
import { ToastBar, Toaster } from "react-hot-toast";
import FilterCard from "./filtercard";
import AddProperty from "./addProp";
import Materials from "./materials";
import DatePicker from "react-datepicker"; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the styles

const AdminDashboard = () => {
  const [active, setActive] = useState(0);

  const [orderFilter, setOrderFilter] = useState({ vendors: [], status: [], addresses: [] });
  const [globalMatchingProducts, setGlobalMatchingProducts] = useState([]);
  const [globalSelectedAddress, setGlobalSelectedAddress] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null); // State to hold selected date

  const [calendarVisible, setCalendarVisible] = useState(false); // Control calendar visibility

  // Handle the click on the calendar icon
  const handleCalendarClick = () => {
    setCalendarVisible(!calendarVisible);
  };
  return (
    <div className="d-flex bg-dark" style={{ height: "100dvh" }}>
      <Toaster />
      <div className="sidebar">
        <Sidebar setActive={(e) => setActive(e)} active={active} />
      </div>

      <div className="mainSection ">
        <div className="w-100 mb-1 py-1 px-2">
          <Header setGlobalMatchingProducts={(e) => setGlobalMatchingProducts(e)} setGlobalSelectedAddress={(e) => setGlobalSelectedAddress(e)} />
        </div>
        <div className="px-1 pb-3 pt-0">
          <div className="mainSectionInner w-100 py-4 px-3 text-light noScrollBar">
            <div className="row mx-0 px-0">
              <div className="col-12">{active !== 3 && <h4 className="display-6 fw-semi-bold">Good Evening 👋</h4>}</div>
              <div className="col-xl-12 mt-2">
                {active == 0 && (
                  <div className="fade-in ">
                    <div className="row">
                      <div className="col-9">
                        <Orders orderFilter={orderFilter} globalSelectedAddress={globalSelectedAddress} date={selectedDate && selectedDate.toISOString().split("T")[0]} />
                      </div>
                      {console.log("selectedDate", selectedDate)}
                      <div className="col-3">
                        <div className="position-sticky top-0 left-0">
                          <div className="position-relative mb-2">
                            <input
                              className="form-control topSearch bg-black  border-1 border-secondary w-100 py-3 px-2  text-light"
                              type="date"
                              disabled
                              value={selectedDate && selectedDate.toISOString().split("T")[0]}
                              // onChange={handleSearch}
                              style={{ borderRadius: "1em" }}
                            />

                            <div className="p-3 position-absolute top-0 end-0 h-100" onClick={handleCalendarClick}>
                              <img src="icons/calendar-range-solid.svg" height={"20px"} />
                            </div>
                            {/* Conditionally render the custom date picker */}
                            {calendarVisible && (
                              <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                inline
                                calendarClassName="custom-calendar" // Optional styling class for the calendar
                              />
                            )}
                          </div>

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
                {active == 2 && (
                  <div className="fade-in position-relative">
                    <AddProperty />
                  </div>
                )}

                {active == 3 && (
                  <div className="fade-in position-relative">
                    <Materials globalMatchingProducts={globalMatchingProducts} />
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
