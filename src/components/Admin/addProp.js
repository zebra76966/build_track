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

  const [managerOptions, setManagerOptions] = useState([]);
  useEffect(() => {
    handleFetchManagers();
  }, []);

  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);

  const [scrapeUrls, setScrapeUrls] = useState([]);
  // const [scrapeUrlInput, setScrapeUrlInput] = useState("");
  const [mainPropertyScrapeUrl, setMainPropertyScrapeUrl] = useState("");

  const [propertyData, setPropertyData] = useState({
    select_property_type: "",
    stage: "",
    title: "",
    choose_image_scraper: [],
    upload_image: null,
    scrapeUrls: [],
    property_type: "",
    address: "",
    state: "",
    city: "",
    postal_code: "",
    project_manager: "",
    block_lot: "",

    // video_link: "",
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
      const filtered = Object.keys(statesData).filter((state) => state.toLowerCase().includes(value.toLowerCase()));
      setFilteredStates(filtered);
    } else {
      setFilteredStates([]);
    }
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setPropertyData({ ...propertyData, city: value });

    if (value.length > 0 && propertyData.state) {
      const filtered = statesData[propertyData.state]?.filter((city) => city.toLowerCase().includes(value.toLowerCase()));
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

  const handleFetchManagers = async () => {
    try {
      const response = await Axios.get("http://127.0.0.1:8000/dashboard/get-all-managers");
      if (response.data && Array.isArray(response.data.managers)) {
        setManagerOptions(response.data.managers);
      } else {
        toast.error("Invalid response format.");
      }
    } catch (error) {
      toast.error("Failed to fetch project managers.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    Object.entries(propertyData).forEach(([key, value]) => {
      if (key === "upload_image" && value) {
        Array.from(value).forEach((file) => formData.append("upload_image", file));
      } else if (key === "choose_image_scraper" && Array.isArray(value)) {
        value.forEach((scraper) => formData.append("choose_image_scraper[]", scraper));
      } else {
        formData.append(key, value);
      }
    });

    formData.append("selected_stage", selectedStage);

    if (propertyData.select_property_type === "Main Property" && mainPropertyScrapeUrl) {
      formData.append("scrape_url", mainPropertyScrapeUrl);
    } else if (propertyData.select_property_type === "Comp Property") {
      if (scrapeUrls && Object.keys(scrapeUrls).length > 0) {
        Object.entries(scrapeUrls).forEach(([scraper, url]) => {
          formData.append(`scrapeUrls[${scraper}]`, url);
        });
      }   
    }

    formData.append("scrapeUrls", JSON.stringify(scrapeUrls));


    try {
      await Axios.post(baseUrl + "/dashboard/add-property/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTresponse("Property added successfully!");
      toast.success("Property added successfully!");

      setPropertyData({
        select_property_type: "",
        choose_image_scraper: [],
        upload_image: null,
        scrapeUrls: {},
        stage: "",
        title: "",
        property_type: "",
        address: "",
        state: "",
        city: "",
        postal_code: "",
        project_manager: "",
        block_lot: "",

        // video_link: "",
        content: "",
      });

      setScrapeUrls({});      
      setMainPropertyScrapeUrl("");
    } catch (error) {
      setTresponse("Failed to add property.");
      toast.error("Failed to add property.");
    } finally {
      setIsLoading(false);
    }

  const requestData = {
      property_name: propertyData.property_name,
      property_address: propertyData.property_address,
      zillow_url: scrapeUrls["Zillow"] || "", // Get the Zillow URL entered by the user
      formatted_address: propertyData.formatted_address,
    };
  
    try {
      const response = await fetch("dashboard/scrappers/zillow.py", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
      console.log("Scrape response:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {isLoading && (
        <div
          className="w-100 d-flex align-items-center justify-content-center position-fixed top-0 start-0"
          style={{ height: "100dvh", zIndex: "99", backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="loader">
            <h4 className="display-6">Processing...</h4>
          </div>
        </div>
      )}

      <div className="bg-black">
        <div className="card bg-dark pBorder mt-2" style={{ width: "80%" }}>
          <div className="d-flex h-100 align-items-center justify-content-center">
            <form onSubmit={handleSubmit} className="row g-3 col-12 p-4 my-2 text-light" style={{ borderRadius: "1rem" }}>
              <h3 className="fw-bold">Add Property</h3>
              <p className="fw-bold text-info">{tresponse}</p>
              <hr />

              {/* Select stage Dropdown */}
              <div className="col-12 col-lg-4">
                <label htmlFor="stage" className="form-label">
                  Stage
                </label>
                <select
                  className="form-control form-select text-light bg-dark shadow-sm p-3 border-light"
                  id="stage"
                  value={selectedStage}
                  onChange={(e) => {
                    setSelectedStage(e.target.value);
                    setPropertyData({ ...propertyData, stage: e.target.value });
                  }}
                  style={{ borderRadius: "10px" }}
                  required
                >
                  <option value="" disabled>
                    Select Stage
                  </option>
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
                .filter((key) => !["stage", "state", "city", "choose_image_scraper", "upload_image", "select_property_type", "scrapeUrls","block_lot"].includes(key))
                .map((key) => {
                  if (key === "property_type") {
                    return (
                      <React.Fragment key={key}>
                        <div className="col-12 col-lg-4" key={key}>
                          <label htmlFor={key} className="form-label">
                            Property Type
                          </label>
                          <select
                            className="form-control form-select text-light bg-dark shadow-sm p-3 border-light"
                            id={key}
                            value={propertyData[key]}
                            onChange={(e) => setPropertyData({ ...propertyData, [key]: e.target.value })}
                            style={{ borderRadius: "10px" }}
                            required
                          >
                            <option value="" disabled>
                              Select Property Type
                            </option>
                            {[
                              "Single Family",
                              "2-4 Multifamily",
                              "5+ Multifamily",
                              "Commercial",
                              "Commercial (Hospital)",
                              "Commercial (Industrial)",
                              "Commercial (Office)",
                              "Commercial (Retail)",
                              "Co-Op",
                              "Condo",
                              "Mobile Home",
                              "Vacant Land",
                            ].map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </React.Fragment>
                    );
                  }

                  if (key === "project_manager") {
                    return (
                      <React.Fragment key={key}>
                        <div className="col-12 col-lg-4">
                          <label htmlFor="project_manager" className="form-label">
                            Project Manager
                          </label>
                          <select
                            className="form-control form-select text-light bg-dark shadow-sm p-3 border-light"
                            id="project_manager"
                            value={propertyData.project_manager}
                            onChange={(e) => setPropertyData({ ...propertyData, project_manager: e.target.value })}
                            style={{ borderRadius: "10px" }}
                            required
                          >
                            <option value="" disabled>
                              Select Project Manager
                            </option>
                            {managerOptions.length > 0 ? (
                              managerOptions.map((manager, index) => (
                                <option key={index} value={manager}>
                                  {manager}
                                </option>
                              ))
                            ) : (
                              <option disabled>Loading Project Manager</option>
                            )}
                          </select>
                        </div>
                        <div className="col-12 col-lg-4">
                          <label htmlFor="block_lot" className="form-label">
                            Block-Lot
                          </label>
                          <input
                            type="text"
                            className="form-control text-light bg-dark shadow-sm p-3 border-light"
                            id="block_lot"
                            placeholder=" eg: 1901-43"
                            value={propertyData.block_lot || ""}
                            onChange={(e) => setPropertyData({ ...propertyData, block_lot: e.target.value })}
                            style={{ borderRadius: '10px' }}
                            required
                          />
                        </div>
                      </React.Fragment>
                    );
                  }

                  if (key === "address") {
                    return (
                      <React.Fragment key={key}>
                        {/* Address Field (Already Present) */}
                        <div className="col-12 col-lg-4">
                          <label htmlFor={key} className="form-label">
                            Address
                          </label>
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
                          <label htmlFor="state" className="form-label">
                            State
                          </label>
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
                            <ul className="list-group position-absolute w-100 bg-dark mt-1 border-light" style={{ maxHeight: "150px", overflowY: "auto", zIndex: 1000 }}>
                              {filteredStates.map((state, index) => (
                                <li key={index} className="list-group-item text-light bg-dark border-light" style={{ cursor: "pointer" }} onClick={() => selectState(state)}>
                                  {state}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="col-12 col-lg-4 position-relative">
                          <label htmlFor="city" className="form-label">
                            City
                          </label>
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
                            <ul className="list-group position-absolute w-100 bg-dark mt-1 border-light" style={{ maxHeight: "150px", overflowY: "auto", zIndex: 1000 }}>
                              {filteredCities.map((city, index) => (
                                <li key={index} className="list-group-item text-light bg-dark border-light" style={{ cursor: "pointer" }} onClick={() => selectCity(city)}>
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
                      <React.Fragment key={key}>
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

                        <div className="col-12 mt-3">
                          <h5 className="text-info fw-bold">Properties</h5>
                          <hr />

                          <div className="row">
                            {/* Select Property Type Dropdown */}
                            <div className="col-12 col-lg-4">
                              <label htmlFor="select_property_type" className="form-label">
                                Select Property Type
                              </label>
                              <select
                                className="form-control form-select text-light bg-dark shadow-sm p-3 border-light"
                                id="select_property_type"
                                value={propertyData.select_property_type}
                                onChange={(e) => setPropertyData({ ...propertyData, select_property_type: e.target.value, choose_image_scraper: [], upload_image: null })}
                                style={{ borderRadius: "10px" }}
                                required
                              >
                                <option value="" disabled>
                                  Select Property Type
                                </option>
                                {["Main Property", "Comp Property"].map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Choose Images Scraper */}
                            <div className="col-12 col-lg-4 mt-2">
                              <label htmlFor="choose_image_scraper" className="form-label">
                                Choose Scrape Image
                              </label>
                              <div>
                                {["Zillow", "Realtor", "BrightMLS"].map((scraper, index) => (
                                  <div key={index} className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      id={`scraper_${scraper}`}
                                      value={scraper}
                                      checked={propertyData.choose_image_scraper.includes(scraper)}
                                      onClick={(e) => {
                                        if (propertyData.choose_image_scraper.includes(scraper)) {
                                          const updatedScrapers = propertyData.choose_image_scraper.filter((item) => item !== scraper);
                                          const updatedUrls = { ...scrapeUrls };
                                          delete updatedUrls[scraper];

                                          setPropertyData({ ...propertyData, choose_image_scraper: updatedScrapers });
                                          setScrapeUrls(updatedUrls);
                                        }
                                      }}
                                      onChange={(e) => {
                                        if (!propertyData.choose_image_scraper.includes(scraper)) {
                                          const updatedScrapers = propertyData.select_property_type === "Main Property" ? [scraper] : [...propertyData.choose_image_scraper, scraper];

                                          setPropertyData({ ...propertyData, choose_image_scraper: updatedScrapers });
                                          setScrapeUrls({ ...scrapeUrls, [scraper]: "" });
                                        }
                                      }}
                                    />
                                    <label className="form-check-label text-light ms-2" htmlFor={`scraper_${scraper}`}>
                                      {scraper}
                                    </label>

                                    {/* Show URL selected scraper */}
                                    {propertyData.choose_image_scraper.includes(scraper) && (
                                      <div className="mt-2">
                                        <input
                                          type="url"
                                          className="form-control text-light bg-dark shadow-sm p-2 border-light"
                                          placeholder={`Enter URL for ${scraper}`}
                                          value={scrapeUrls[scraper] || ""}
                                          onChange={(e) => {
                                            setScrapeUrls({ ...scrapeUrls, [scraper]: e.target.value });
                                          }}
                                          style={{ borderRadius: "10px", width: "100%" }}
                                        />
                                        {scrapeUrls[scraper] && (
                                          <div className="d-flex align-items-center mt-1">
                                            <span className="text-light">🔗 {scrapeUrls[scraper].length > 10 ? scrapeUrls[scraper].substring(0, 10) + "..." : scrapeUrls[scraper]}</span>
                                            <button
                                              type="button"
                                              className="btn btn-sm text-white ms-2"
                                              onClick={() => {
                                                const updatedUrls = { ...scrapeUrls };
                                                delete updatedUrls[scraper];
                                                setScrapeUrls(updatedUrls);
                                              }}
                                            >
                                              ❌
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Upload Image (Only for Main Property) */}
                            {propertyData.select_property_type === "Main Property" && (
                              <div className="col-12 col-lg-4">
                                <label htmlFor="upload_image" className="form-label">
                                  Upload Images
                                </label>
                                <input
                                  type="file"
                                  className="form-control text-light bg-dark shadow-sm p-3 border-light"
                                  id="upload_image"
                                  multiple
                                  onChange={(e) => {
                                    const newFiles = Array.from(e.target.files);
                                    setPropertyData({
                                      ...propertyData,
                                      upload_image: [...(propertyData.upload_image || []), ...newFiles],
                                    });
                                  }}
                                  style={{ borderRadius: "10px" }}
                                  accept="image/*"
                                  required
                                />
                                {/* Display Selected Images with Shortened Names */}
                                {propertyData.upload_image && propertyData.upload_image.length > 0 && (
                                  <ul className="list-group mt-2">
                                    {propertyData.upload_image.map((file, index) => (
                                      <li
                                        key={index}
                                        className="list-group-item d-flex justify-content-between align-items-center bg-dark text-light border-light"
                                        style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                      >
                                        {file.name.length > 7 ? file.name.substring(0, 10) + "..." : file.name}
                                        <button
                                          type="button"
                                          className="btn btn-sm text-white"
                                          onClick={() => {
                                            const updatedFiles = propertyData.upload_image.filter((_, i) => i !== index);
                                            setPropertyData({ ...propertyData, upload_image: updatedFiles });
                                          }}
                                        >
                                          ❌
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
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
