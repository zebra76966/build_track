import React, { useState, useEffect, useRef } from "react";
import { baseUrl } from "../config";
import toast from "react-hot-toast";
import axios from "axios";
import { Cheerio } from "cheerio";
import iconsData from "./materialscat.json";
import DatePicker from "react-datepicker"; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the styles

const Materials = ({ globalMatchingProducts, seMaterialDate }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [active, setActive] = useState("");
  const [activeDetail, setActiveDetail] = useState("");

  const handleDetailView = async () => {
    setIsloading(true);

    try {
      const response = await fetch(baseUrl + `/dashboard/transactions/${active}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setActiveDetail(data);
    } catch (error) {
      toast.error("Something went wrong while fetching transactions.");
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    if (active !== "") {
      handleDetailView();
    }
  }, [active]);

  const getIcon = (name) => {
    const item = iconsData.find((item) => item.name === name);
    return item ? item.icon : "logo192.png";
  };

  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    setIsloading(true);

    try {
      const response = await fetch(baseUrl + `/dashboard/get-categories/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      toast.error("Something went wrong while fetching transactions.");
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const hasFetched = useRef(false);

  const handlesubmit = async () => {
    setIsloading(true);

    try {
      const response = await fetch(baseUrl + "/dashboard/transactions/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setTransactions(data);
      setFilteredTransactions(data); // Set both original and filtered data
    } catch (error) {
      toast.error("Something went wrong while fetching transactions.");
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      handlesubmit();
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState({ field: "", order: "" });

  const handleSort = (field) => {
    const order = sortOrder.field === field && sortOrder.order === "asc" ? "desc" : "asc";
    const sortedData = [...filteredTransactions].sort((a, b) => {
      if (field === "date") {
        return order === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      } else if (field === "amount") {
        return order === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
    setSortOrder({ field, order });
    setFilteredTransactions(sortedData); // Sort only the filtered data
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredData = transactions.filter((transaction) => Object.values(transaction).some((field) => String(field).toLowerCase().includes(value)));
    setFilteredTransactions(filteredData); // Update the filtered data
  };

  // for calender picker
  const dateInputRef = useRef(null);

  const [isFull, setIsFull] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryClick = (category) => {
    setSelectedCategories((prevSelected) => (prevSelected.includes(category) ? prevSelected.filter((c) => c !== category) : [...prevSelected, category]));
  };

  // Date Filtering===========>
  const [selectedDate, setSelectedDate] = useState(null); // State to hold selected date

  const [calendarVisible, setCalendarVisible] = useState(false); // Control calendar visibility

  // Handle the click on the calendar icon
  const handleCalendarClick = () => {
    setCalendarVisible(!calendarVisible);
  };

  // Date Filtering===========>

  useEffect(() => {
    if (selectedDate) {
      seMaterialDate(selectedDate);
    }
  }, [selectedDate]);

  const [viewAll, setViewAll] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const options = ["HD", "AMZ", "WM"];
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionChange = (option) => {
    let updatedSelection = [...selectedOptions];

    if (updatedSelection.includes(option)) {
      updatedSelection = updatedSelection.filter((item) => item !== option);
    } else {
      updatedSelection.push(option);
    }

    setSelectedOptions(updatedSelection);
  };

  const filteredProducts =
    selectedCategories.length || selectedOptions.length
      ? globalMatchingProducts.filter((product) =>
          (selectedCategories.length ? selectedCategories.includes(product.category) : true) && (selectedOptions.length ? selectedOptions.includes(product.vendor) : true) && searchTerm.length
            ? product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
            : true
        )
      : globalMatchingProducts;

  return (
    <>
      {console.log("categories", selectedCategories)}
      <div className="w-100 p-3">
        <h4 className="fs-3 my-0 py-0 mb-4">Materials</h4>
        <div className="position-relative ">
          <input
            className="form-control topSearch bg-black  border-1 border-secondary w-100 py-3 px-5  text-light"
            type="search"
            placeholder="Search..."
            aria-label="Search"
            // value={searchTerm}
            onChange={handleSearch}
            style={{ borderRadius: "1em" }}
          />
          <img src="icons/search.svg" className="searchIconFull" alt="Search" />
          <div className="p-1 position-absolute top-0 end-0 h-100">
            <button className="btn btn-dark border-secondary  h-100 px-4" style={{ borderRadius: "0.9em" }} onClick={handlesubmit}>
              Search
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center gap-5 mt-5 mb-4">
          <div className="d-flex align-items-center gap-3  ">
            <p className="lead text-secondary mb-0"> Appliances</p>

            <div className="position-relative mb-2">
              <div className="position-absolute  mb-2  start-0" style={{ zIndex: "9999", width: "200px", transform: calendarVisible ? "translateY(-10%)" : "translateY(-50%)" }}>
                <input
                  className="form-control topSearch bg-black  border-1 border-secondary w-100 py-3 px-2  text-light"
                  type="date"
                  disabled
                  value={selectedDate && selectedDate.toISOString().split("T")[0]}
                  // onChange={handleSearch}
                  style={{ borderRadius: "1em", transition: "width 0.3s ease-in" }}
                />

                <div className="p-3 position-absolute top-0 end-0 h-100" onClick={handleCalendarClick}>
                  <img src="icons/calendar-range-solid.svg" height={"20px"} />
                </div>
                {/* Conditionally render the custom date picker */}
                {calendarVisible && (
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                      setSelectedDate(localDate);
                    }}
                    inline
                    calendarClassName="custom-calendar" // Optional styling class for the calendar
                  />
                )}
              </div>
            </div>
          </div>

          <div className="dropdown  ms-auto me-4" style={{ maxWidth: "160px" }}>
            <button className="btn btn-dark border-secondary  rounded-3 px-4 dropdown-toggle" type="button" onClick={toggleDropdown}>
              {selectedOptions.length > 0 ? selectedOptions.join(", ") : "Select Vendors"}
            </button>
            <ul className={`dropdown-menu bg-dark w-100  ${dropdownOpen ? "show" : ""}`} style={{ left: "05%" }}>
              {options.map((option, index) => (
                <li key={index} className="dropdown-item text-light">
                  <label className="form-check-label">
                    <input type="checkbox" className="form-check-input me-2" checked={selectedOptions.includes(option)} onChange={() => handleOptionChange(option)} />
                    {option == "Amazon" ? "AMZ" : option == "Walmart" ? "WM" : option}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="tags mt-3">
          {categories.slice(0, viewAll ? categories.length - 1 : 8)?.map((category, index) => (
            <button
              key={index}
              className={`btn rounded-pill fs-5 me-1 mb-2 ${selectedCategories.includes(category) ? "bg-primary text-dark" : "btn-dark text-secondary"}`}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="d-flex align-items-center gap-3">
                <span>{category}</span>
                <img src={getIcon(category)} height={20} alt="icon" style={{ filter: selectedCategories.includes(category) ? "invert(1)" : "invert(0)" }} />
              </div>
            </button>
          ))}

          <button className={`btn rounded-pill fs-5 me-1 mb-2 bg-black border-primary border-1 border  text-primary `} onClick={() => setViewAll(!viewAll)}>
            <div className="d-flex align-items-center gap-3">
              <span>{viewAll ? "Show Less" : "Show More"}</span>
            </div>
          </button>
        </div>
      </div>

      <div className="w-100 p-3 mt-2">
        <div className="row  align-items-stretch p-1 px-0 mb-1 fw-bold">
          {/* <div className="col-1 h-100 position-relative  d-flex px-1 py-0">
            <p className="fs-6 mb-1 text-light">#</p>
          </div> */}
          <div className="col-4 d-flex flex-column justify-content-center border-end border-1 border-secondary">
            <p className="fs-6 mb-1 text-light">Name</p>
          </div>
          {/* <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-6 text-light mb-0 text-center">Pricing</p>
          </div> */}
          <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-7 text-light mb-0 text-center">Suggested Qty.</p>
          </div>
          <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-6 text-light mb-0 fw-bold text-center">Pack Qty.</p>
          </div>
          <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-6 text-light mb-0 text-center">Ordered Qty.</p>
          </div>

          <div className="col-2 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-6 text-light mb-0  text-center">ID</p>
          </div>

          <div className="col-2 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-6 text-light mb-0  text-center">Vendor</p>
          </div>
        </div>

        {filteredProducts.map((ini, index) => (
          <div className="row border-1 border border-secondary align-items-stretch p-1 px-0 mb-1" style={{ borderRadius: "1em", height: isFull ? "100%" : "85px", cursor: "pointer" }} key={index}>
            {/* <div className="col-1 h-100 position-relative  d-flex px-1 py-0">
              <img src={`${getProductImageUrl(ini.link)}`} className="w-100 " style={{ objectFit: "cover", height: isFull ? "85px" : "100%", borderRadius: "0.8em 0 0 0.8em" }} />
            </div> */}
            <div className="col-4 d-flex flex-column justify-content-center border-end border-1 border-secondary">
              <p className="fs-6 mb-1 text-light text-truncate w-75">{ini.common_name}</p>
              <p className={`text-secondary mb-1 ${isFull ? "" : "textClamp-2"} small`} onClick={() => setIsFull(!isFull)}>
                {ini.product_name}
              </p>
            </div>
            {/* <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
              <p className="fs-6 text-light mb-0 text-center">$29.07</p>
            </div> */}
            <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
              <p className="fs-6 text-light mb-0 text-center"></p>
            </div>
            <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
              <p className="fs-6 text-light mb-0 text-center">{ini.pack_quantity}</p>
            </div>
            <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
              <p className="fs-6 text-light mb-0 fw-bold text-center text-break">{ini.total_quantity}</p>
            </div>

            <div className="col-2 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
              <p className="fs-6 text-light mb-0  text-center">{ini.order_id}</p>
            </div>

            <div className="col-2 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
              <p className="fs-6 text-light mb-0  text-center">{ini.vendor}</p>
            </div>

            <div className="col-1  justify-content-center align-items-center d-flex gap-4 pe-1">
              <a herf={ini.link} target="_blank">
                <img src="icons/eye.svg" height={30} className="w-100" />
              </a>

              {/* <button className="btn btn-dark border-secondary  h-100 px-4  fw-bold w-50 me-0" style={{ borderRadius: "0.9em" }} onClick={handlesubmit}>
                <span className="fs-3"> ? </span>
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Materials;
