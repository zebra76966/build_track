import React, { useState, useEffect } from "react";
import Axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../config";
import statesData from "../../assets/US_States_and_Cities.json";

const AddProperty = () => {
  document.title = "Add Property";

  useEffect(() => {
    window.scrollTo(0, 0);
    handleFetchStages(); 
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [tresponse, setTresponse] = useState("");
  const [stageOptions, setStageOptions] = useState([]); 
  const [selectedStage, setSelectedStage] = useState(""); 

  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);


  const [propertyData, setPropertyData] = useState({
    stage: "",
    title: "",
    project_manager: "",
    property_type: "",
    address: "",
    state: "",
    city: "",
    postal_code: "",
    video_link: "",
    content: "",
  });

  const handleFetchStages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(baseUrl + "/dashboard/get-all-folder-names/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
  
      if (data && typeof data === "object") {
        const formattedStages = Object.entries(data).map(([key, value]) => ({
          key,
          value,
        })); 
  
        setStageOptions(formattedStages);
      } else {
        toast.error("Invalid response format.");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching stages.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setPropertyData({ ...propertyData, state: value });

    if (value.length > 0) {
      const filtered = Object.keys(statesData).filter((state) =>
        state.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStates(filtered);
    } else {
      setFilteredStates([]);
    }
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setPropertyData({ ...propertyData, city: value });

    if (value.length > 0 && propertyData.state) {
      const filtered = statesData[propertyData.state]?.filter((city) =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered || []);
    } else {
      setFilteredCities([]);
    }
  };

    // Select a State
    const selectState = (state) => {
      setPropertyData({ ...propertyData, state, city: "" });
      setFilteredStates([]);
      setFilteredCities(statesData[state] || []);
    };
  
    // Select a City
    const selectCity = (city) => {
      setPropertyData({ ...propertyData, city });
      setFilteredCities([]);
    };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const finalData = { ...propertyData, selected_stage: selectedStage }; 

    Axios.post(baseUrl + "/dashboard/add-property/", finalData, {
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        setTresponse("Property added successfully!");
        toast.success("Property added successfully!");
        setPropertyData({
          title: "",
          stage: "",  
          project_manager: "",
          property_type: "",
          address: "",
          city: "",
          state: "",
          postal_code: "",
          video_link: "",
          content: "",
        });
        setSelectedStage("");
      })
      .catch(() => {
        setTresponse("Failed to add property.");
        toast.error("Failed to add property.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && (
        <div className="w-100 d-flex align-items-center justify-content-center position-fixed top-0 start-0"
          style={{ height: "100dvh", zIndex: "99", backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="loader"><h4 className="display-6">Processing...</h4></div>
        </div>
      )}

      <div className="bg-black">
        <div className="card bg-dark pBorder mt-2" style={{ width: "80%" }}>
          <div className="d-flex h-100 align-items-center justify-content-center">
            <form onSubmit={handleSubmit} className="row g-3 col-12 p-4 my-2 text-light" style={{ borderRadius: "1rem" }}>
              <h3 className="fw-bold">Add Property</h3>
              <p className="fw-bold text-info">{tresponse}</p>
              <hr />

              <div className="col-12 col-lg-4">
                <label htmlFor="stage" className="form-label">Stage</label>
                  <select
                      className="form-control form-select text-light bg-dark shadow-sm p-3 border-light"
                      id="stage"
                      value={propertyData.stage}  
                      onChange={(e) => setPropertyData({ ...propertyData, stage: e.target.value })}  
                      style={{ borderRadius: "10px" }}
                      required
                    >
                      <option value="" disabled>Select Stage</option>
                      {stageOptions.length > 0 ? (
                        stageOptions.map((stage, index) => (
                          <option key={index} value={stage.key}>
                            {stage.key}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading stages...</option>
                      )}
                  </select>
              </div>
              
              {Object.keys(propertyData)
              .filter((key) => !["stage", "state", "city"].includes(key))
              .map((key) => {
                
                if (key === "property_type") {
                  return (
                    <div className="col-12 col-lg-4" key={key}>
                      <label htmlFor={key} className="form-label">Property Type</label>
                      <select
                        className="form-control form-select text-light bg-dark shadow-sm p-3 border-light"
                        id={key}
                        value={propertyData[key]}
                        onChange={(e) => setPropertyData({ ...propertyData, [key]: e.target.value })}
                        style={{ borderRadius: "10px" }}
                        required
                      >
                        <option value="" disabled>Select Property Type</option>
                        {[
                          "Single Family", "2-4 Multifamily", "5+ Multifamily", "Commercial",
                          "Commercial (Hospital)", "Commercial (Industrial)", "Commercial (Office)",
                          "Commercial (Retail)", "Co-Op", "Condo", "Mobile Home", "Vacant Land",
                        ].map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (key === "address") {
                  return (
                    <React.Fragment key={key}>
                      {/* Address Field (Already Present) */}
                      <div className="col-12 col-lg-4">
                        <label htmlFor={key} className="form-label">Address</label>
                        <input
                          type="text"
                          className="form-control text-light bg-dark shadow-sm p-3 border-light"
                          id={key}
                          placeholder="Enter Address"
                          value={propertyData[key]}
                          onChange={(e) => setPropertyData({ ...propertyData, [key]: e.target.value })}
                          style={{ borderRadius: "10px" }}
                          required
                        />
                      </div>
              
                      <div className="col-12 col-lg-4 position-relative">
                        <label htmlFor="state" className="form-label">State</label>
                        <input
                          type="text"
                          className="form-control text-light bg-dark shadow-sm p-3 border-light"
                          id="state"
                          placeholder="Enter State"
                          value={propertyData.state}
                          onChange={handleStateChange}
                          style={{ borderRadius: "10px" }}
                          required
                        />
                        {filteredStates.length > 0 && (
                          <ul className="list-group position-absolute w-100 bg-dark mt-1 border-light"
                              style={{ maxHeight: "150px", overflowY: "auto", zIndex: 1000 }}>
                            {filteredStates.map((state, index) => (
                              <li
                                key={index}
                                className="list-group-item text-light bg-dark border-light"
                                style={{ cursor: "pointer" }}
                                onClick={() => selectState(state)}
                              >
                                {state}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
              
                      <div className="col-12 col-lg-4 position-relative">
                        <label htmlFor="city" className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control text-light bg-dark shadow-sm p-3 border-light"
                          id="city"
                          placeholder="Enter City"
                          value={propertyData.city}
                          onChange={handleCityChange}
                          style={{ borderRadius: "10px" }}
                          required
                        />
                        {filteredCities.length > 0 && (
                          <ul className="list-group position-absolute w-100 bg-dark mt-1 border-light"
                              style={{ maxHeight: "150px", overflowY: "auto", zIndex: 1000 }}>
                            {filteredCities.map((city, index) => (
                              <li
                                key={index}
                                className="list-group-item text-light bg-dark border-light"
                                style={{ cursor: "pointer" }}
                                onClick={() => selectCity(city)}
                              >
                                {city}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </React.Fragment>
                  );
                }

                if (key === "content") {
                  return (
                    <div className="col-12" key={key}>
                      <label htmlFor={key} className="form-label">
                        {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                      </label>
                      <textarea
                        rows="5"
                        className="form-control text-light bg-dark shadow-sm p-3 border-light"
                        id={key}
                        placeholder={`Enter ${key.replace(/_/g, " ")}`}
                        value={propertyData[key]}
                        onChange={(e) => setPropertyData({ ...propertyData, [key]: e.target.value })}
                        style={{ borderRadius: "10px" }}
                        required
                      />
                    </div>
                  );
                }

                return (
                  <div className="col-12 col-lg-4" key={key}>
                    <label htmlFor={key} className="form-label">
                      {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      className="form-control text-light bg-dark shadow-sm p-3 border-light"
                      id={key}
                      placeholder={`Enter ${key.replace(/_/g, " ")}`}
                      value={propertyData[key]}
                      onChange={(e) => setPropertyData({ ...propertyData, [key]: e.target.value })}
                      style={{ borderRadius: "10px" }}
                      required
                    />
                  </div>
                );
              })}
              
              <div className="col-md-4 py-2 ms-auto" style={{ borderRadius: "10px" }}>
                <button type="submit" className="btn w-100 fw-bold py-3 btn-lg bg-black text-light" style={{ borderRadius: "10px" }}>
                  Submit
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProperty;
