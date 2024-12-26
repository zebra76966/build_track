import React, { useEffect, useState, useRef } from "react";
import { baseUrl } from "../config";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [active, setActive] = useState("");
  const [activeDetail, setActiveDetail] = useState("");

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

  return (
    <div className="w-100 ordersTable bg-dark p-3">
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

      {activeDetail && active !== "" && (
        <div class="CustomModal fade-in">
          <div class="CustomModal-content position-relative bg-dark">
            <div class="bg-black text-light d-flex align-items-center justify-content-between p-3">
              <h5 class="fs-5" id="exampleModalLabel">
                ID : #{active}
              </h5>
              <button type="button" class="btn-close" style={{ filter: "invert(1)" }} onClick={() => setActive("")}></button>
            </div>
            <div class="modal-body text-light">
              <h5 className="fs-4">{activeDetail.source}</h5>
              <p className="pt-0 mt-0 text-secondary">{activeDetail.address}</p>
              {/* <p className="lead mb-5">{activeDetail.description}</p> */}

              <h6 className="fs-5 fw-light  mt-5 pt-5">
                Status:{" "}
                <span
                  className={`fw-bold ${
                    activeDetail.order_status.toLowerCase() === "pending"
                      ? "text-danger"
                      : activeDetail.order_status.toLowerCase() === "complete"
                      ? "text-success"
                      : activeDetail.order_status.toLowerCase() === "delivered" || activeDetail.order_status.toLowerCase() === "shipped"
                      ? "text-info"
                      : "text-warning"
                  }`}
                >
                  {activeDetail.order_status}
                </span>
              </h6>
              <p className="text-secondary mb-3">{activeDetail.delivery_date}</p>

              <h5 className="fs-4 fw-bold text-success">${activeDetail.grand_total_amount}</h5>
            </div>
            <div class="modal-footer bg-black position-absolute bottom-0 w-100">
              <button type="button" class="btn btn-info" onClick={() => setActive("")}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredOrders && filteredOrders.length > 0 && (
        <table className="table text-light">
          <thead className="thead">
            <tr>
              <th scope="col">#Id</th>
              <th scope="col">Source</th>
              <th scope="col">Address</th>
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
            {filteredOrders.map((ini) => (
              <tr key={ini.order_id} onClick={() => setActive(ini.order_id)} style={{ cursor: "pointer" }}>
                <th scope="row">{ini.order_id}</th>
                <td>{ini.source}</td>
                <td>{ini.address}</td>
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
    </div>
  );
};

export default Orders;
