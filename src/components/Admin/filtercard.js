import React, { useState, useEffect } from "react";
import "./filtercard.css";
import { baseUrl } from "../config";
import toast from "react-hot-toast";

const FilterCard = ({ filter, setFilter }) => {
  const [udata, setUdata] = useState({ vendors: [], status: [], addresses: [] });
  const [searchTerm, setSearchTerm] = useState("");

  const vendors = ["HD", "Amazon", "Walmart"];
  const status = ["Pending", "Being Processed", "Shipped", "Complete", "Delivered", "Cancelled", "Arriving"];

  const handleSearch = (e) => {
    setFilter(udata);
  };

  const [masterAddresses, setMasterAdresses] = useState([]);

  const handleFetchMasterAddress = async () => {
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
      // setIsloading(false);
    }
  };

  useEffect(() => {
    handleFetchMasterAddress();
  }, []);

  return (
    <div className="filter-card bg-dark p-3 border-1 border-light border" style={{ borderRadius: "1.5em" }}>
      <div className="position-relative">
        <input
          className="form-control me-2 topSearch bg-black rounded-pill border-0 px-5 py-2 text-light"
          type="search"
          placeholder="Search..."
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img src="icons/search.svg" className="searchIcon" alt="Search" />
      </div>

      <hr />

      <h5 className="text-light  fs-5 fw-light mb-3 ">Vendors</h5>
      <div className="w-100 slim-scroll text-secondary" style={{ maxHeight: "150px", overflowY: "auto" }}>
        {vendors
          .filter((ini) => ini.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((jini, k) => (
            <div class="form-check mb-1 fs-6 fw-light" key={k}>
              <input
                class="form-check-input"
                type="checkbox"
                value={jini}
                id={`vendors${k}`}
                onChange={(e) => {
                  const newInterests = [...udata.vendors];
                  const interestIndex = newInterests.indexOf(e.target.value.toLowerCase());

                  if (interestIndex === -1) {
                    // Item doesn't exist in the array, so add it.
                    newInterests.push(e.target.value.toLowerCase());
                  } else {
                    // Item exists in the array, so remove it.
                    newInterests.splice(interestIndex, 1);
                  }

                  setUdata({ ...udata, vendors: newInterests });
                }}
                checked={udata.vendors.includes(jini.toLowerCase()) ? true : false}
              />
              <label class="form-check-label" for="flexCheckChecked">
                {jini}
              </label>
            </div>
          ))}
      </div>

      <hr />
      <h5 className="text-light  fs-5 fw-light mt-4 mb-3">Status</h5>
      <div className="w-100 slim-scroll mb-4 text-secondary fs-6 fw-light" style={{ maxHeight: "150px", overflowY: "auto" }}>
        {status.map((jini, k) => (
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              value={jini}
              id={`status${k}`}
              onClick={(e) => {
                const newInterests = [...udata.status];
                const interestIndex = newInterests.indexOf(e.target.value.toLowerCase());

                if (interestIndex === -1) {
                  // Item doesn't exist in the array, so add it.
                  newInterests.push(e.target.value.toLowerCase());
                } else {
                  // Item exists in the array, so remove it.
                  newInterests.splice(interestIndex, 1);
                }

                setUdata({ ...udata, status: newInterests });
              }}
              checked={udata.status.includes(jini.toLowerCase()) ? true : false}
            />
            <label class="form-check-label" for="flexCheckChecked">
              {jini}
            </label>
          </div>
        ))}
      </div>

      <hr />
      {/* <h5 className="text-light  fs-5 fw-light mt-4 mb-3">Master Addresses</h5>
      <div className="w-100 slim-scroll mb-4 text-secondary fs-6 fw-light" style={{ maxHeight: "150px", overflowY: "auto" }}>
        {masterAddresses &&
          masterAddresses.map((jini, k) => (
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value={jini.master_address}
                id={`addresses${k}`}
                onClick={(e) => {
                  const newInterests = [...udata.addresses];
                  const interestIndex = newInterests.indexOf(e.target.value);

                  if (interestIndex === -1) {
                    // Item doesn't exist in the array, so add it.
                    newInterests.push(e.target.value);
                  } else {
                    // Item exists in the array, so remove it.
                    newInterests.splice(interestIndex, 1);
                  }

                  setUdata({ ...udata, addresses: newInterests });
                }}
                checked={udata.addresses.includes(jini.master_address) ? true : false}
              />
              <label class="form-check-label" for="flexCheckChecked">
                {jini.master_address}
              </label>
            </div>
          ))}
      </div> */}

      <buton className="btn btn-light rounded-3 mt-2 fw-bol w-100" onClick={handleSearch}>
        Apply Filters
      </buton>
    </div>
  );
};

export default FilterCard;
