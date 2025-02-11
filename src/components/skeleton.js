import React from "react";
import "./skeleton.css";

const Skeleton = () => {
  return (
    <div className="w-100" style={{ overflowX: "hidden" }}>
      {[...Array(10)].map((_, i) => (
        <div className="d-flex" key={i}>
          <div class="Skeletoncard w-50">
            <div class="Skeletoncard__skeleton Skeletoncard__title"></div>
          </div>
          <div class="Skeletoncard w-25">
            <div class="Skeletoncard__skeleton Skeletoncard__title"></div>
          </div>
          <div class="Skeletoncard w-75">
            <div class="Skeletoncard__skeleton Skeletoncard__title"></div>
          </div>
          <div class="Skeletoncard w-25">
            <div class="Skeletoncard__skeleton Skeletoncard__title"></div>
          </div>
          <div class="Skeletoncard w-25">
            <div class="Skeletoncard__skeleton Skeletoncard__title"></div>
          </div>
          <div class="Skeletoncard w-25">
            <div class="Skeletoncard__skeleton Skeletoncard__title"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
