import React, { useEffect, useState, useRef } from "react";
import { baseUrl } from "../config";
import toast from "react-hot-toast";
import Skeleton from "../skeleton";

const Orders = ({ orderFilter }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [active, setActive] = useState("");
  const [activeDetail, setActiveDetail] = useState("");

  const [filters, setFilters] = useState({ vendors: [], status: [] });

  useEffect(() => {
    setIsloading(true);

    setTimeout(() => {
      setFilters(orderFilter);
      setIsloading(false);
    }, 3000);
  }, [orderFilter]);

  const handleDetailView = async () => {
    setIsloading(true);

    try {
      const response = await fetch(baseUrl + `/dashboard/orders/${active}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setActiveDetail(data);
    } catch (error) {
      toast.error("Something went wrong while fetching order details.");
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    if (active !== "") {
      handleDetailView();
    }
  }, [active]);

  const hasFetched = useRef(false);
  const handlesubmit = async () => {
    setIsloading(true);

    try {
      const response = await fetch(baseUrl + "/dashboard/orders/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data); // Set filtered orders to match the original data
    } catch (error) {
      toast.error("Something went wrong while fetching orders.");
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
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredOrders = orders.filter((order) => Object.values(order).some((val) => String(val).toLowerCase().includes(value)));
    setFilteredOrders(filteredOrders); // Update filtered data
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedOrders = [...filteredOrders].sort((a, b) => {
      if (key === "grand_total_amount") {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      } else if (key === "delivery_date") {
        return direction === "asc" ? new Date(a[key]) - new Date(b[key]) : new Date(b[key]) - new Date(a[key]);
      } else {
        return 0;
      }
    });
    setFilteredOrders(sortedOrders); // Sort only the filtered data
  };

  const [fixAddressModal, setFixaAddressModal] = useState(false);

  const [masterAddresses, setMasterAdresses] = useState([]);

  const handleFetchMasterAddress = async () => {
    setIsloading(true);

    try {
      const response = await fetch(baseUrl + "/dashboard/pos/", {
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

  const [ediMasterid, setEditMasterId] = useState("");

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

  // Delete PO================>

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

  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="w-100 ordersTable bg-dark p-3">
      {console.log(orderFilter)}
      <div className="d-flex align-items-center justify-content-between p-3">
        <h4 className="fs-3 my-0 py-0">Recent Orders</h4>

        <div className="w-50 d-flex align-items-center gap-2 ms-auto justify-content-end">
          <div className="position-relative">
            <input
              className="form-control me-2 topSearch bg-black rounded-pill border-0 px-5 py-2 text-light"
              type="search"
              placeholder="Search..."
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
            <img src="icons/search.svg" className="searchIcon" alt="Search" />
          </div>
          <img src="icons/more-vertical.svg" height={15} alt="More" />
        </div>
      </div>
      {console.log(fixAddressModal)}

      {activeDetail && active !== "" && (
        <div class="CustomModal fade-in shadow-lg">
          <div class="CustomModal-content position-relative bg-dark" style={{ borderRadius: "1.1em" }}>
            <div class="bg-black text-light d-flex align-items-center justify-content-between p-3" style={{ borderRadius: "1.1em" }}>
              <h5 class="fs-5" id="exampleModalLabel">
                ID : #{active}
              </h5>
              <button type="button" class="btn-close" style={{ filter: "invert(1)" }} onClick={() => setActive("")}></button>
            </div>

            <div class="modal-body text-light">
              <div className="d-flex justify-content-center">
                <div className="border-1 border-light border rounded-pill d-flex gap-1 p-1">
                  <button className={`btn ${fixAddressModal ? "btn-outline-light border-0" : "btn-light"} rounded-pill`} onClick={() => setFixaAddressModal(false)}>
                    Detail
                  </button>
                  <button className={`btn ${!fixAddressModal ? "btn-outline-light border-0" : "btn-light "} rounded-pill`} onClick={() => setFixaAddressModal(true)}>
                    Edit Address
                  </button>
                </div>
              </div>
              {console.log(activeDetail)}
              {!fixAddressModal ? (
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <h5 className="fs-5 fw-light">
                      Vendor : <span className="fw-bold">{activeDetail.source}</span>
                    </h5>

                    <h6 className="fs-6 fw-light  mt-2 pt-2">
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
                  </div>

                  <div className="row pb-5 pt-3">
                    <div className="col-md-6 ">
                      <div class="card shadow text-white bg-blackOpac mb-3 w-100 border-secondary h-100" style={{ borderRadius: "1.1em" }}>
                        <div class="card-header border-secondary">Shipping Address</div>
                        <div class="card-body">
                          <p className="pt-0 mt-0"> Shipping Address : {activeDetail.address}</p>
                          <p className="">
                            Scrapped Address : <strong>{activeDetail.scrapped_address ? activeDetail.scrapped_address : "Not Found"}</strong>{" "}
                          </p>
                          <p className="">
                            Scrapped PO : <strong>{activeDetail.scrapped_po ? activeDetail.scrapped_po : "Not Found"}</strong>{" "}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 ">
                      <div class="card shadow text-white bg-blackOpac mb-3 w-100 border-secondary h-100" style={{ borderRadius: "1.1em" }}>
                        <div class="card-header border-secondary">System Addresses</div>
                        <div class="card-body">
                          <p className="fs-6 mt-0 mb-4">
                            Master Address : <strong>{activeDetail.master_address ? activeDetail.master_address : "Not Found"}</strong>{" "}
                          </p>
                          <p className="fs-6 mt-1 mb-0">
                            PO : <strong>{activeDetail.PO ? activeDetail.PO : "Not Found"}</strong>{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-secondary mb-1 mt-2"> Delivered by : {activeDetail.delivery_date}</p>

                  <h5 className="fs-5 fw-light">
                    {" "}
                    Total Amount : <span className="fw-bold text-success"> ${activeDetail.grand_total_amount}</span>
                  </h5>
                </div>
              ) : (
                <div className="w-100 pb-4">
                  <h5 className="fs-4">Edit Address</h5>

                  {activeDetail.PO && (
                    <div className="d-flex gap-3 align-items-center  mb-5 mt-4">
                      <p className="fs-5 py-0 my-0 border-end border-1 border-light pe-2">
                        Current PO: <span className="text-info">{activeDetail.PO}</span>{" "}
                      </p>
                      {!confirmDelete ? (
                        <button type="button" class="btn btn-danger" onClick={() => setConfirmDelete(true)}>
                          Delete
                        </button>
                      ) : (
                        <button type="button" class="btn btn-warning" onClick={handleDeletePOAddress}>
                          Confirm
                        </button>
                      )}
                    </div>
                  )}

                  <p className={`pt-0 mt-0 text-secondary ${activeDetail.PO ? "" : "mt-5"} mb-0`}>Change PO</p>

                  <div className="d-flex gap-4 align-items-center  mb-5 ">
                    <select value={ediMasterid} onChange={(e) => setEditMasterId(e.target.value)} className="form-select bg-dark text-light  mb-3 mt-2" aria-label=".form-select-lg example">
                      <option value={null} selected className="text-muted">
                        ----Select PO----
                      </option>
                      {masterAddresses
                        .filter((ini) => ini.vendor == activeDetail.source)
                        .map((ini, i) => {
                          return (
                            <option value={ini.id}>
                              {ini.po_name} ({ini.vendor})
                            </option>
                          );
                        })}
                    </select>

                    <button type="button" class="btn btn-info" onClick={handleEditMasterAddress}>
                      Save
                    </button>
                  </div>
                </div>
              )}

              {console.log(ediMasterid)}
            </div>

            <div class="modal-footer bg-black position-absolute bottom-0 w-100" style={{ borderRadius: "1.1em" }}>
              <button type="button" class="btn btn-info" onClick={() => setActive("")}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && <Skeleton />}

      {!isLoading && (
        <>
          {filteredOrders && filteredOrders.length > 0 && (
            <table className="table text-light" style={{ filter: activeDetail && active !== "" && "blur(10px)" }}>
              <thead className="thead">
                <tr>
                  <th scope="col">#Id</th>
                  <th scope="col">Source</th>
                  <th scope="col">M. Address</th>
                  <th scope="col" onClick={() => handleSort("delivery_date")} style={{ cursor: "pointer", textDecoration: "none", userSelect: "none" }}>
                    Dated {sortConfig.key === "delivery_date" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col" onClick={() => handleSort("grand_total_amount")} style={{ cursor: "pointer", textDecoration: "none", userSelect: "none" }}>
                    Price {sortConfig.key === "grand_total_amount" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders
                  .filter((jini) => {
                    if (filters.vendors.length == 0 && filters.status.length == 0) {
                      return true;
                    }
                    if (filters.vendors.length == 0 && filters.status.length !== 0) {
                      return filters.status.includes(jini.order_status.toLowerCase());
                    }
                    if (filters.vendors.length !== 0 && filters.status.length == 0) {
                      return filters.vendors.includes(jini.source.toLowerCase());
                    }
                    if (filters.vendors.length !== 0 && filters.status.length !== 0) {
                      return filters.vendors.includes(jini.source.toLowerCase()) && filters.status.includes(jini.order_status.toLowerCase());
                    }
                  })
                  .map((ini, i) => (
                    <tr key={i} onClick={() => setActive(ini.order_id)} style={{ cursor: "pointer" }}>
                      <th scope="row">{ini.order_id}</th>
                      <td>{ini.source}</td>
                      <td
                        onClick={() => {
                          setFixaAddressModal(true);
                        }}
                        className={`${!ini.master_address ? "edit-address text-warning" : ""}`}
                      >
                        {!ini.master_address ? (
                          <>
                            <span className="txt-2 pe-2">{"No matching master address found"}</span>
                            <img src="icons/pen.svg" className="ms-1 border-start border-light ps-2" height={20} />
                          </>
                        ) : (
                          <span className="txt-1">{ini.master_address}</span>
                        )}
                      </td>
                      <td>{ini.delivery_date}</td>
                      <td
                        className={`${
                          ini.order_status.toLowerCase() === "pending"
                            ? "text-danger"
                            : ini.order_status.toLowerCase() === "complete"
                            ? "text-success"
                            : ini.order_status.toLowerCase() === "delivered" || ini.order_status.toLowerCase() === "shipped"
                            ? "text-info"
                            : "text-warning"
                        }`}
                      >
                        {ini.order_status}
                      </td>
                      <td className="fw-bold">${ini.grand_total_amount}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
