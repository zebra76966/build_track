import React from "react";
import { useState, useEffect } from "react";

const Paginate = (props) => {
  const [totalNumbers, setTotalNumber] = useState(10);

  useEffect(() => {
    const updateTotalNumbers = () => {
      // You can adjust the logic based on your requirements
      const screenWidth = window.innerWidth;
      let updatedTotalNumbers;

      // Add your own logic to determine the totalNumbers based on screenWidth
      // For example, you can set different totalNumbers for different screen sizes
      if (screenWidth >= 1200) {
        updatedTotalNumbers = 8;
      } else if (screenWidth >= 768) {
        updatedTotalNumbers = 3;
      } else {
        updatedTotalNumbers = 2;
      }

      setTotalNumber(updatedTotalNumbers);
    };

    // Initial update
    updateTotalNumbers();

    // Event listener for window resize
    window.addEventListener("resize", updateTotalNumbers);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateTotalNumbers);
    };
  }, []); // Empty dependency array means this effect will run once on mount

  return (
    <nav aria-label="Page navigation example ">
      {console.log(totalNumbers)}
      <ul className={`pagination ${totalNumbers > 2 ? " pagination-lg" : "pagination-sm"} justify-content-center `}>
        <li className={`page-item shadow-lg ${props.cactive === 1 ? "disabled " : ""}`}>
          <span
            className={`page-link ${props.cactive === 1 ? "text-secondary bg-muted " : "text-light"}`}
            onClick={() => props.pagecount(props.cactive - 1)}
            aria-disabled={`${props.cactive === 1 ? "true" : ""}`}
          >
            Prev
          </span>
        </li>

        {totalNumbers >= 8 && props.total <= 50 ? (
          <>
            {[...Array(Math.ceil(props.total / props.perEnteries))].map((ini, i) => {
              return (
                <li key={i} className={`page-item shadow-lg ${props.cactive === i + 1 ? "active" : ""}`}>
                  <a href="#results" className="page-link text-light" onClick={() => props.pagecount(i + 1)}>
                    {i + 1}
                  </a>
                </li>
              );
            })}
          </>
        ) : (
          <>
            {props.cactive > 2 && (
              <li key={1} className={`page-item shadow-lg ${props.cactive === 1 ? "active" : ""}`}>
                <a href="#results" className="page-link text-light" onClick={() => props.pagecount(1)}>
                  {1}
                </a>
              </li>
            )}
            {props.cactive > 2 && (
              <li className={`page-item shadow-lg`}>
                <a href="#results" className="page-link text-light">
                  ...
                </a>
              </li>
            )}

            {[...Array(Math.ceil(props.total / props.perEnteries))]
              .slice(Math.max(0, props.cactive - 2), Math.min(Math.ceil(props.total / props.perEnteries), props.cactive + totalNumbers))
              .map((_, i) => {
                const pageNumber =
                  i === totalNumbers + 1 && props.cactive !== 1
                    ? Math.ceil(props.total / props.perEnteries)
                    : Math.max(1, Math.min(Math.ceil(props.total / props.perEnteries), props.cactive !== 1 ? props.cactive - 2 + i + 1 : props.cactive - 1 + i + 1));
                let isEllipsis = false;
                if (props.cactive == 1) {
                  isEllipsis = i === totalNumbers;
                } else {
                  isEllipsis = i === totalNumbers + 1;
                }
                return (
                  <>
                    <li key={i} className={`page-item shadow-lg ${props.cactive === pageNumber ? "active" : ""}`}>
                      <a href="#results" className="page-link text-light" onClick={() => props.pagecount(pageNumber)}>
                        {isEllipsis ? "..." : pageNumber}
                      </a>
                    </li>
                    {isEllipsis && props.cactive !== 1 && (
                      <li key={i} className={`page-item shadow-lg ${props.cactive === pageNumber ? "active" : ""}`}>
                        <a href="#results" className="page-link text-light" onClick={() => props.pagecount(pageNumber)}>
                          {pageNumber}
                        </a>
                      </li>
                    )}
                    {isEllipsis && props.cactive == 1 && (
                      <li key={i} className={`page-item shadow-lg ${props.cactive === Math.ceil(props.total / props.perEnteries) ? "active" : ""}`}>
                        <a href="#results" className="page-link text-light" onClick={() => props.pagecount(Math.ceil(props.total / props.perEnteries))}>
                          {Math.ceil(props.total / props.perEnteries)}
                        </a>
                      </li>
                    )}
                  </>
                );
              })}
          </>
        )}
        <li className={`page-item shadow-lg ${props.cactive === Math.ceil(props.total / props.perEnteries) ? "disabled" : ""}`}>
          <span
            className={`page-link ${props.cactive === Math.ceil(props.total / props.perEnteries) ? "text-secondary bg-muted " : "text-light"}`}
            onClick={() => props.pagecount(props.cactive + 1)}
            aria-disabled={`${props.cactive === Math.ceil(props.total / props.perEnteries) ? "true" : ""}`}
          >
            Next
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default Paginate;
