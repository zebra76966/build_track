import React, { useState, useEffect, useRef } from "react";
import { baseUrl } from "../config";
import toast from "react-hot-toast";
import axios from "axios";
import { Cheerio } from "cheerio";

const Materials = ({ globalMatchingProducts }) => {
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

  const cheerio = require("cheerio");

  async function getProductImageUrl(productUrl) {
    try {
      const { data } = await axios.get(productUrl, {
        headers: { "User-Agent": "Mozilla/5.0" }, // Avoid bot detection
      });

      const $ = cheerio.load(data);
      const imageUrl = $('meta[property="og:image"]').attr("content");
      console.log("Image URL:", imageUrl);

      return imageUrl || null; // Return image URL or null if not found
    } catch (error) {
      console.error("Error fetching Amazon page:", error.message);
      return null;
    }
  }

  const [isFull, setIsFull] = useState(false);

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
            value={searchTerm}
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

        <div className="d-flex align-items-center gap-3 mt-3">
          <p className="lead text-secondary mb-0"> Appliances</p>
          <div className="position-relative">
            <input
              className="form-control topSearch bg-black  border-1 border-secondary w-100 py-3 px-2  text-light"
              type="date"
              // value={searchTerm}
              // onChange={handleSearch}
              style={{ borderRadius: "1em" }}
            />

            <div className="p-3 position-absolute top-0 end-0 h-100">
              <img src="icons/calendar-range-solid.svg" height={"100%"} />
            </div>
          </div>
        </div>

        <div className="tags mt-3">
          <button className="btn btn-dark rounded-pill  fs-5 me-1 text-secondary">
            <div className="d-flex align-items-center gap-3">
              <span>Demo</span>
              <img src="icons/trash-can-solid.svg" height={20} />
            </div>
          </button>

          <button className="btn btn-dark bg-primary text-dark rounded-pill  fs-5 me-1 ">
            <div className="d-flex align-items-center gap-3">
              <span>Fastners</span>
              <img src="icons/screwdriver-solid.svg" height={20} />
            </div>
          </button>

          <button className="btn btn-dark bg-primary text-dark rounded-pill  fs-5 me-1 ">
            <div className="d-flex align-items-center gap-3">
              <span>Lumber</span>
              <img src="icons/cabin-solid.svg" height={20} />
            </div>
          </button>

          <button className="btn btn-dark rounded-pill  fs-5 me-1 text-secondary">
            <div className="d-flex align-items-center gap-3">
              <span>Insulation</span>
              <img src="icons/temperature-snow-sharp-regular.svg" height={20} />
            </div>
          </button>

          <button className="btn btn-dark rounded-pill  fs-5 me-1 text-secondary">
            <div className="d-flex align-items-center gap-3">
              <span>Roofing</span>
              <img src="icons/person-shelter-sharp-solid.svg" height={20} />
            </div>
          </button>

          <button className="btn btn-dark bg-primary text-dark rounded-pill fs-5 me-1">
            <div className="d-flex align-items-center gap-3">
              <span>Windows & Doors</span>
              <img src="icons/window-frame-sharp-solid.svg" height={20} />
            </div>
          </button>
          <button className="btn btn-dark bg-primary text-dark rounded-pill fs-5 me-1">
            <div className="d-flex align-items-center gap-3">
              <span>Exterior</span>
              <img src="icons/office.svg" height={20} />
            </div>
          </button>

          <button className="btn btn-dark bg-black border-primary text-primary rounded-pill fs-5 me-1">
            <div className="d-flex align-items-center gap-3 px-4">
              <span>More</span>
            </div>
          </button>
        </div>
      </div>

      <div className="w-100 p-3 mt-2">
        <div className="row  align-items-stretch p-1 px-0 mb-1 fw-bold">
          {/* <div className="col-1 h-100 position-relative  d-flex px-1 py-0">
            <p className="fs-6 mb-1 text-light">#</p>
          </div> */}
          <div className="col-5 d-flex flex-column justify-content-center border-end border-1 border-secondary">
            <p className="fs-6 mb-1 text-light">Name</p>
          </div>
          {/* <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-6 text-light mb-0 text-center">Pricing</p>
          </div> */}
          <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-6 text-light mb-0 text-center">Suggested Pack Qty.</p>
          </div>
          <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-6 text-light mb-0 text-center">Qty.</p>
          </div>
          <div className="col-2 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-6 text-light mb-0 fw-bold text-center">Cat.</p>
          </div>

          <div className="col-2 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
            <p className="fs-6 text-light mb-0  text-center">ID</p>
          </div>
        </div>

        {globalMatchingProducts.map((ini, index) => (
          <div className="row border-1 border border-secondary align-items-stretch p-1 px-0 mb-1" style={{ borderRadius: "1em", height: isFull ? "100%" : "85px", cursor: "pointer" }} key={index}>
            {/* <div className="col-1 h-100 position-relative  d-flex px-1 py-0">
              <img src={`${getProductImageUrl(ini.link)}`} className="w-100 " style={{ objectFit: "cover", height: isFull ? "85px" : "100%", borderRadius: "0.8em 0 0 0.8em" }} />
            </div> */}
            <div className="col-5 d-flex flex-column justify-content-center border-end border-1 border-secondary">
              <p className="fs-6 mb-1 text-light text-truncate w-75">{ini.common_name}</p>
              <p className={`text-secondary mb-1 ${isFull ? "" : "textClamp-2"} small`} onClick={() => setIsFull(!isFull)}>
                {ini.product_name}
              </p>
            </div>
            {/* <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
              <p className="fs-6 text-light mb-0 text-center">$29.07</p>
            </div> */}
            <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
              <p className="fs-6 text-light mb-0 text-center">{ini.pack_quantity}</p>
            </div>
            <div className="col-1 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
              <p className="fs-6 text-light mb-0 text-center">{ini.total_quantity}</p>
            </div>
            <div className="col-2 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
              <p className="fs-6 text-light mb-0 fw-bold text-center text-break">{ini.category}</p>
            </div>

            <div className="col-2 border-end flex-column justify-content-center d-flex border-1 border-secondary ">
              <p className="fs-6 text-light mb-0  text-center">{ini.order_id}</p>
            </div>

            <div className="col-1   justify-content-center align-items-center d-flex gap-4 pe-1">
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
