import React from "react";
import OrdersData from "./mockorders.json";
import TransactionsData from "./mockTrans.json";

const TodoList = () => {
  function formatDate(inputDate) {
    // Parse the input date string
    const date = new Date(inputDate);

    // Extract month, day, and year
    const month = date.getMonth() + 1; // getMonth() returns 0-based month
    const day = date.getDate();
    const year = date.getFullYear() % 100; // Extract last two digits of the year

    // Return formatted date as MM/DD/YY
    return `${month}/${day}/${year}`;
  }

  return (
    <div className="w-100 ordersTable bg-dark p-3">
      <div className="d-flex align-items-center justify-content-between p-3">
        <h4 className="fs-3 my-0 py-0"> To-do list</h4>

        <div className="w-50 d-flex align-items-center gap-2 ms-auto justify-content-end">
          <div className="position-relative">
            <input class="form-control me-2 topSearch bg-black rounded-pill border-0 px-5 py-2" type="search" placeholder="Search..." aria-label="Search" />

            <img src="icons/search.svg" className="searchIcon" />
          </div>

          <img src="icons/more-vertical.svg" height={15} />
        </div>
      </div>

      <table class="table ">
        <thead className="text-light thead">
          <tr className="border-0 ">
            <th scope="col">#</th>
            <th scope="col">Desc</th>

            <th scope="col">Dated</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody className="border-0">
          {TransactionsData.slice(0, 4).map((ini, i) => {
            return (
              <tr key={ini.transaction_id}>
                <th className="p-2" scope="row">
                  {i + 1}
                </th>
                <td className="p-2">{ini.description}</td>

                <td className="p-2">{formatDate(ini.date)}</td>
                <td
                  className={`${
                    OrdersData[i].orderStatus.toLocaleLowerCase() == "pending"
                      ? "text-danger"
                      : OrdersData[i].orderStatus.toLocaleLowerCase() == "paid"
                      ? "text-success"
                      : OrdersData[i].orderStatus.toLocaleLowerCase() == "mailed"
                      ? "text-info"
                      : "text-warning"
                  }  p-2`}
                >
                  {OrdersData[i].orderStatus}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
