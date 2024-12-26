import React, { useState, useEffect } from "react";
import TransactionsData from "./mockTrans.json";
import { baseUrl } from "../config";
import toast from "react-hot-toast";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsloading] = useState(false);

  const handlesubmit = async () => {
    setIsloading(true);

    try {
      // const response = await fetch(baseUrl + "/bookings/search-flight/basic/", {
      const response = await fetch(baseUrl + "/dashboard/transactions/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      // Assuming the API returns a `data.offers` array
      setTransactions(data);
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
  const [sortOrder, setSortOrder] = useState({ field: "", order: "" });

  const handleSort = (field) => {
    const order = sortOrder.field === field && sortOrder.order === "asc" ? "desc" : "asc";
    const sortedData = [...transactions].sort((a, b) => {
      if (field === "date") {
        return order === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      } else if (field === "amount") {
        return order === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
    setSortOrder({ field, order });
    setTransactions(sortedData);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredData = TransactionsData.filter((transaction) => Object.values(transaction).some((field) => String(field).toLowerCase().includes(value)));
    setTransactions(filteredData);
  };

  return (
    <div className="w-100 ordersTable bg-dark p-3">
      <div className="d-flex align-items-center justify-content-between p-3">
        <h4 className="fs-3 my-0 py-0">Recent Transactions</h4>
        <div className="d-flex align-items-center gap-2 ms-auto">
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
          <img src="icons/more-vertical.svg" height={15} />
        </div>
      </div>

      <div className="w-100" style={{ overflowX: "auto" }}>
        {transactions && transactions.length > 0 && (
          <table className="table">
            <thead className="text-light thead">
              <tr className="border-0">
                <th scope="col">#Id</th>
                <th scope="col">Name</th>
                <th scope="col">Desc.</th>
                <th scope="col">Recipient</th>
                <th scope="col" onClick={() => handleSort("date")} style={{ cursor: "pointer", textDecoration: "none", userSelect: "none" }}>
                  Date {sortOrder.field === "date" ? (sortOrder.order === "asc" ? "↑" : "↓") : ""}
                </th>
                <th scope="col">Status</th>
                <th scope="col" onClick={() => handleSort("amount")} style={{ cursor: "pointer", textDecoration: "none", userSelect: "none" }}>
                  Price {sortOrder.field === "amount" ? (sortOrder.order === "asc" ? "↑" : "↓") : ""}
                </th>
              </tr>
            </thead>
            <tbody className="border-0">
              {transactions.map((transaction) => (
                <tr key={transaction.transaction_id}>
                  <th scope="row">{transaction.transaction_id.slice(0, 5)}***</th>
                  <td>{transaction.name}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.recipient}</td>
                  <td>{transaction.date}</td>
                  <td
                    className={`${
                      transaction.status.toLocaleLowerCase() === "pending"
                        ? "text-danger"
                        : transaction.status.toLocaleLowerCase() === "paid"
                        ? "text-success"
                        : transaction.status.toLocaleLowerCase() === "mailed"
                        ? "text-info"
                        : "text-warning"
                    }`}
                  >
                    {transaction.status}
                  </td>
                  <td className="fw-bold">${transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Transactions;
