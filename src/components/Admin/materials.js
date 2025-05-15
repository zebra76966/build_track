import React, { useState, useEffect, useRef, useContext } from "react";
import { baseUrl } from "../config";
import toast from "react-hot-toast";
import axios from "axios";
import { Cheerio } from "cheerio";
import iconsData from "./materialscat.json";
import DatePicker from "react-datepicker"; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the styles
import { AuthContext } from "./auth/authContext";
import Paginate from "./paginate";

const Materials = ({ globalMatchingProducts, seMaterialDate, globalSelectedAddress, setGlobalMatchingProducts }) => {
  document.title = "Materials";
  const { accessToken, clearToken, saveToken } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [active, setActive] = useState("");
  const [activeDetail, setActiveDetail] = useState("");
  const [showIdColumn, setShowIdColumn] = useState(false); // Default: Show ID column

  const [fixAddressModal, setFixaAddressModal] = useState(false);
  const [masterAddresses, setMasterAdresses] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [ediMasterid, setEditMasterId] = useState("");

  // const handleDetailView = async () => {
  //   setIsloading(true);

  //   try {
  //     const response = await fetch(baseUrl + `/dashboard/transactions/${active}`, {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     const data = await response.json();
  //     setActiveDetail(data);
  //   } catch (error) {
  //     toast.error("Something went wrong while fetching transactions.");
  //   } finally {
  //     setIsloading(false);
  //   }
  // };

  const handleDetailView = async (id) => {
    setIsloading(true);
    try {
      const response = await fetch(`${baseUrl}/dashboard/orders/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setActive(id);
      setActiveDetail(data);
    } catch (error) {
      // toast.error("Failed to fetch product details.");
    } finally {
      setIsloading(false);
    }
  };

  const handleDeletePOAddress = async () => {
    if (active !== "") {
      setIsloading(true);

      try {
        const response = await fetch(baseUrl + `/dashboard/orders/${active}/remove-po-master/`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        toast.success("Success!");
        setConfirmDelete(false);
        setActive("");
        handlesubmit();
      } catch (error) {
        toast.error("Something went wrong while fetching orders.");
      } finally {
        setIsloading(false);
      }
    } else {
      toast.error("Please select a valid option.");
    }
  };

  const handleEditMasterAddress = async () => {
    if (ediMasterid !== "") {
      setIsloading(true);

      try {
        const response = await fetch(baseUrl + `/dashboard/orders/${active}/update-po-master/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            po_id: ediMasterid,
          }),
        });
        const data = await response.json();
        console.log("address", data);
        toast.success("Success!");
        setEditMasterId("");
        setActive("");
        handlesubmit();
      } catch (error) {
        toast.error("Something went wrong while fetching orders.");
      } finally {
        setIsloading(false);
      }
    } else {
      toast.error("Please select a valid option.");
    }
  };

  useEffect(() => {
    if (active !== "") {
      handleDetailView();
    }
  }, [active]);

  const getIcon = (name) => {
    const item = iconsData.find((item) => item.name === name);
    return item ? item.icon : "/logo192.png";
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
  const toggleAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]); // deselect all
    } else {
      setSelectedCategories(categories); // select all
    }
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
    seMaterialDate(selectedDate);
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

  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [products, setProducts] = useState([]);

  const fetchSortedProducts = async (sortOrder, sortBy) => {
    let body = {
      sort_by: sortBy,
      sort_order: sortOrder,
      master_address_id: globalSelectedAddress ? globalSelectedAddress : null,
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

      setGlobalMatchingProducts(data.matching_products);

      // if (response.data && response.data.matching_products) {
      //   setGlobalMatchingProducts(response.data.matching_products);
      //   // setProducts(response.data.matching_products);
      //   toast.success("Products sorted successfully!");
      // } else {
      //   toast.error("No products found.");
      // }
    } catch (error) {
      console.error("Sorting error:", error.response?.data || error.message);
      toast.error("Failed to fetch sorted products.");
    }
  };

  useEffect(() => {
    console.log("sortOrder", selectedSortOption);
    let sortOrder = selectedSortOption == "Newest to Oldest" ? "asc" : "desc";
    let sortBy = "delivered_date";
    fetchSortedProducts(sortOrder, sortBy);
  }, [selectedSortOption]);

  const toggleSortDropdown = () => {
    setSortDropdownOpen((prev) => !prev);
  };

  const filteredProducts =
    selectedCategories.length || selectedOptions.length || searchTerm.length
      ? globalMatchingProducts.filter(
          (product) =>
            (selectedCategories.length ? selectedCategories.includes(product.category) : true) &&
            (selectedOptions.length ? selectedOptions.includes(product.vendor) : true) &&
            (searchTerm.length ? product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
        )
      : globalMatchingProducts;

  const [pnum, setPNum] = useState(1);

  const [modalImage, setModalImage] = useState("");
  const modalRef = useRef();

  const handleMouseEnter = (image) => {
    setModalImage(image || "/suppl.jpg");

    // Show Bootstrap 5 modal manually
    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();
  };

  const handleMouseLeave = () => {
    const modalEl = modalRef.current;
    const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  return (
    <>
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
          <img src="/icons/search.svg" className="searchIconFull" alt="Search" />
          <div className="p-1 position-absolute top-0 end-0 h-100">
            <button className="btn btn-dark border-secondary  h-100 px-4" style={{ borderRadius: "0.9em" }} onClick={handlesubmit}>
              Search
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center gap-5 mt-5 mb-4">
          <div className="d-flex align-items-center gap-3  ">
            <p className=" text-secondary mb-0"> Appliances</p>

            <div className="position-relative mb-2">
              <div className="position-absolute  mb-2  start-0" style={{ zIndex: "9999", width: "200px", transform: calendarVisible ? "translateY(-10%)" : "translateY(-50%)" }}>
                <input
                  className="form-control topSearch bg-black  border-1 border-secondary w-100 py-3 px-2  text-light"
                  type="text"
                  disabled
                  value={
                    selectedDate ? `${String(selectedDate.getMonth() + 1).padStart(2, "0")}/${String(selectedDate.getDate()).padStart(2, "0")}/${String(selectedDate.getFullYear()).slice(-2)}` : ""
                  }
                  placeholder="MM/DD/YY"
                  style={{ borderRadius: "1em", transition: "width 0.3s ease-in" }}
                />

                <div className="p-3 position-absolute top-0 end-0  d-flex gap-2 align-items-center">
                  <img src="/icons/calendar-range-solid.svg" style={{ cursor: "pointer" }} height={"20px"} onClick={handleCalendarClick} />
                  <i className="fa fa-repeat fs-4 text-light border-start border-light border-1 ps-2" onClick={() => setSelectedDate(null)} style={{ cursor: "pointer" }} />
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
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="d-flex gap-4 ms-auto me-4">
            {/* New Sort by Order Date Dropdown */}
            <div className="dropdown" style={{ maxWidth: "200px" }}>
              <button className="btn btn-dark border-secondary rounded-3 px-4 dropdown-toggle" type="button" id="order" data-bs-toggle="dropdown" aria-expanded="false" style={{ minWidth: "180px" }}>
                {selectedSortOption || "Sort by Delivered Date"}
              </button>
              <ul className={`dropdown-menu bg-dark w-100`} aria-labelledby="order">
                {["Newest to Oldest", "Oldest to Newest"].map((sortOption, index) => (
                  <li key={index} className="dropdown-item text-light">
                    <button className="btn btn-dark w-100 text-start" onClick={() => setSelectedSortOption(sortOption)}>
                      {sortOption}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button className="btn btn-dark border-secondary rounded-3 px-4" type="button" onClick={() => setShowIdColumn((prev) => !prev)} style={{ minWidth: "120px" }}>
              {showIdColumn ? "Hide ID" : "Show ID"}
            </button>

            <div className="dropdown" style={{ maxWidth: "160px" }}>
              <button className="btn btn-dark border-secondary rounded-3 px-4 dropdown-toggle" type="button" onClick={toggleDropdown} style={{ minWidth: "180px" }}>
                {selectedOptions.length > 0 ? selectedOptions.join(", ") : "Select Vendors"}
              </button>
              <ul className={`dropdown-menu bg-dark w-100 ${dropdownOpen ? "show" : ""}`} style={{ left: "05%" }}>
                {options.map((option, index) => (
                  <li key={index} className="dropdown-item text-light">
                    <label className="form-check-label">
                      <input type="checkbox" className="form-check-input me-2" checked={selectedOptions.includes(option)} onChange={() => handleOptionChange(option)} />
                      {option === "Amazon" ? "AMZ" : option === "Walmart" ? "WM" : option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="tags mt-3">
          <button className={`btn rounded-pill fs-6 me-1 mb-2 ${selectedCategories.length === categories.length ? "bg-info text-dark" : "btn-dark text-secondary"}`} onClick={toggleAll}>
            {selectedCategories.length === categories.length ? "Deselect All" : "Select All"}

            <img
              src={"/icons/toggle-off-solid.svg"}
              height={24}
              alt="icon"
              style={{
                filter: selectedCategories.length === categories.length ? "invert(0)" : "invert(1)",
                transform: selectedCategories.length === categories.length ? "rotate(180deg)" : "rotate(0deg)",
              }}
              className="ms-1"
            />
          </button>

          {categories.slice(0, viewAll ? categories.length - 1 : 8)?.map((category, index) => (
            <button
              key={index}
              className={`btn rounded-pill fs-6 me-1 mb-2 ${selectedCategories.includes(category) ? "bg-primary text-dark" : "btn-dark text-secondary"}`}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="d-flex align-items-center gap-3">
                <span>{category}</span>
                <img src={getIcon(category)} height={20} alt="icon" style={{ filter: selectedCategories.includes(category) ? "invert(1)" : "invert(0)" }} />
              </div>
            </button>
          ))}

          <button className={`btn rounded-pill fs-6 me-1 mb-2 bg-black border-primary border-1 border  text-primary `} onClick={() => setViewAll(!viewAll)}>
            <div className="d-flex align-items-center gap-3">
              <span>{viewAll ? "Show Less" : "Show More"}</span>
            </div>
          </button>
        </div>
      </div>

      {activeDetail && active !== "" && (
        <div className="CustomModal fade-in shadow-lg">
          <div className="CustomModal-content position-relative bg-dark" style={{ borderRadius: "1.1em" }}>
            <div className="bg-black text-light d-flex align-items-center justify-content-between p-3" style={{ borderRadius: "1.1em" }}>
              <h5 className="fs-5">Material ID: #{activeDetail.order_id}</h5>
              <button type="button" className="btn-close" style={{ filter: "invert(1)" }} onClick={() => setActive("")}></button>
            </div>

            <div className="modal-body text-light">
              <div className="d-flex justify-content-center">
                <div className="border-1 border-light  border rounded-pill d-flex gap-1 p-1">
                  <button className={`btn ${fixAddressModal ? "btn-outline-light border-0" : "btn-light"} rounded-pill`} onClick={() => setFixaAddressModal(false)}>
                    Detail
                  </button>
                  {/* <button className={`btn ${!fixAddressModal ? "btn-outline-light border-0" : "btn-light "} rounded-pill`} onClick={() => setFixaAddressModal(true)}>
                      Edit Address
                    </button> */}
                </div>
              </div>

              {!fixAddressModal ? (
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <h5 className="fs-5 fw-light">
                      Vendor: <span className="fw-bold">{activeDetail.source}</span>
                    </h5>

                    {activeDetail.order_status && (
                      <div className="text-end">
                        <h6 className="fs-6 fw-light mt-2 pt-2">
                          Status:{" "}
                          <span
                            className={`fw-bold p-2 rounded-3 ${
                              activeDetail.order_status.toLowerCase() === "pending"
                                ? "bg-danger"
                                : activeDetail.order_status.toLowerCase() === "complete"
                                ? "bg-success"
                                : activeDetail.order_status.toLowerCase() === "delivered" || activeDetail.order_status.toLowerCase() === "shipped"
                                ? "bg-info"
                                : "bg-warning"
                            }`}
                          >
                            {activeDetail.order_status}
                          </span>
                        </h6>
                        <p className="text-secondary mt-3">{activeDetail.status}</p>
                      </div>
                    )}
                  </div>

                  <div className="row pb-5 pt-3">
                    <div className="col-md-6">
                      <div className="card shadow text-white bg-blackOpac mb-3 w-100 border-secondary h-100" style={{ borderRadius: "1.1em" }}>
                        <div className="card-header border-secondary">Shipping Information</div>
                        <div className="card-body">
                          <p>
                            Scrapped Address: <strong>{activeDetail.scrapped_address || "Not Available"}</strong>
                          </p>
                          <p>
                            Master Address: <strong>{activeDetail.master_address || "Not Available"}</strong>
                          </p>
                          <p>
                            Scrapped PO: <strong>{activeDetail.scrapped_po || "Not Found"}</strong>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card shadow text-white bg-blackOpac mb-3 w-100 border-secondary h-100" style={{ borderRadius: "1.1em" }}>
                        <div className="card-header border-secondary">Order Details</div>
                        <div className="card-body">
                          <p>
                            Ordered Date: <strong>{activeDetail.ordered_date}</strong>
                          </p>
                          <p>
                            Delivery Date: <strong>{activeDetail.delivery_date}</strong>
                          </p>
                          <p>
                            Delivery Message: <strong>{activeDetail.delivery_message || "Not Available"}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h5 className="fs-5 fw-light">
                    Total Amount: <span className="fw-bold text-success">${activeDetail.grand_total_amount}</span>
                  </h5>
                </div>
              ) : (
                <div className="w-100 pb-4">
                  <h5 className="fs-4">Edit Address</h5>

                  {activeDetail.PO && (
                    <div className="d-flex gap-3 align-items-center mb-5 mt-4">
                      <p className="fs-5 py-0 my-0 border-end border-1 border-light pe-2">
                        Current PO: <span className="text-info">{activeDetail.PO}</span>{" "}
                      </p>
                      {!confirmDelete ? (
                        <button type="button" className="btn btn-danger" onClick={() => setConfirmDelete(true)}>
                          Delete
                        </button>
                      ) : (
                        <button type="button" className="btn btn-warning" onClick={handleDeletePOAddress}>
                          Confirm
                        </button>
                      )}
                    </div>
                  )}

                  <p className={`pt-0 mt-0 text-secondary ${activeDetail.PO ? "" : "mt-5"} mb-0`}>Change PO</p>

                  <div className="d-flex gap-4 align-items-center mb-5">
                    <select value={ediMasterid} onChange={(e) => setEditMasterId(e.target.value)} className="form-select bg-dark text-light mb-3 mt-2">
                      <option value={null} selected className="text-muted">
                        ----Select PO----
                      </option>
                      {masterAddresses
                        .filter((ini) => ini.vendor === activeDetail.source)
                        .map((ini, i) => (
                          <option key={i} value={ini.id}>
                            {ini.po_name} ({ini.vendor})
                          </option>
                        ))}
                    </select>

                    <button type="button" className="btn btn-info" onClick={handleEditMasterAddress}>
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer bg-black position-absolute bottom-0 w-100" style={{ borderRadius: "1.1em" }}>
              <button type="button" className="btn btn-info" onClick={() => setActive("")}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-100 p-3 mt-2">
        <div className="row  align-items-stretch p-1 px-0 mb-1 fw-bold">
          <div className="col-1 h-100 position-relative  d-flex px-1 py-0">
            <p className="fs-6 mb-1 text-light">#</p>
          </div>
          <div className="col-5 d-flex flex-column justify-content-center border-end border-1 border-secondary">
            <p className="fs-6-md mb-1 text-light">Name</p>
          </div>
          {/* <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-6 text-light mb-0 text-center">Pricing</p>
          </div> */}
          <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-6-md text-light mb-0 text-center">Suggested Qty.</p>
          </div>
          <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-6-md text-light mb-0 fw-bold text-center">Pack Qty.</p>
          </div>
          <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-6-md text-light mb-0 text-center">Ordered Qty.</p>
          </div>

          {showIdColumn && (
            <div className="col-2 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
              <p className="fs-6-md text-light mb-0 text-center">ID</p>
            </div>
          )}

          <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-6-md text-light mb-0  text-center">Vendor</p>
          </div>
        </div>

        {filteredProducts.length != 0 && (
          <div className=" position-sticky" style={{ zIndex: "999", top: "94%", height: "0" }}>
            <Paginate pagecount={(e) => setPNum(e)} total={filteredProducts.length} cactive={pnum} perEnteries={50} />
          </div>
        )}

        {filteredProducts.slice(pnum * 50 - 50, pnum * 50).map((ini, index) => (
          <div className="row border-1 border border-secondary align-items-stretch p-1 px-0 mb-1" style={{ borderRadius: "1em", height: isFull ? "100%" : "85px", cursor: "pointer" }} key={index}>
            <div
              className="col-1 h-100 position-relative  d-flex px-1 py-0"
              onClick={() => handleMouseEnter(ini.material_image || "/suppl.jpg")}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: "zoom-in" }}
            >
              <img src={`${ini.material_image || "/suppl.jpg"}`} className="w-100 " style={{ objectFit: "cover", height: isFull ? "85px" : "100%", borderRadius: "0.8em 0 0 0.8em" }} />
            </div>
            {/* Bootstrap Modal */}
            <div className="modal fade" tabIndex="-1" ref={modalRef} aria-hidden="true" style={{ cursor: "zoom-out" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body p-0">
                    <img src={modalImage} alt="Enlarged" className="w-100" style={{ borderRadius: "0.5em" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-5 d-flex flex-column justify-content-center border-end border-1 border-secondary">
              <p className="fs-6-sm mb-1 text-light text-truncate w-75">{ini.common_name}</p>
              <p className={`text-secondary mb-1 ${isFull ? "" : "textClamp-2"} small-sm`} onClick={() => setIsFull(!isFull)}>
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
            {showIdColumn && (
              <div className="col-2 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
                <p className="fs-6 text-light mb-0 text-center">{ini.order_id}</p>
              </div>
            )}

            <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
              <p className="fs-6 text-light mb-0  text-center">{ini.vendor}</p>
            </div>

            <div className="col-1  justify-content-center align-items-center d-flex gap-2 pe-1 " key={index}>
              {/* <a herf={ini.link} target="_blank">
                <img src="/icons/eye.svg" height={30} className="w-100" />
              </a> */}

              <button className="btn p-0 border-0 bg-transparent" onClick={() => handleDetailView(ini.order_id)}>
                <img src="/icons/eye.svg" height={30} className="w-100" alt="View Details" />
              </button>

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
