import React, { useEffect, useState } from "react";
import OrdersData from "./mockorders.json";
import { baseUrl } from "../config";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsloading] = useState(false);

  const handlesubmit = async () => {
    setIsloading(true);

    try {
      // const response = await fetch(baseUrl + "/bookings/search-flight/basic/", {
      const response = await fetch(baseUrl + "/dashboard/orders/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      // Assuming the API returns a `data.offers` array
      setOrders(data);
    } catch (error) {
      toast.error("Something went wrong while fetching flights.");
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    handlesubmit();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredOrders = OrdersData.filter((order) => Object.values(order).some((val) => String(val).toLowerCase().includes(value)));
    setOrders(filteredOrders);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedOrders = [...orders].sort((a, b) => {
      if (key === "grand_total_amount") {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      } else if (key === "delivery_date") {
        return direction === "asc" ? new Date(a[key]) - new Date(b[key]) : new Date(b[key]) - new Date(a[key]);
      } else {
        return 0;
      }
    });
    setOrders(sortedOrders);
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

      {orders && orders.length > 0 && (
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
            {orders.map((ini) => (
              <tr key={ini.order_id}>
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
