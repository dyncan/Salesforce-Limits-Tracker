import React from "react";

const Spinner = () => {
  return (
    <div
      className="demo-only demo-only_viewport demo--inverse"
      style={{
        position: "relative",
      }}
    >
      <div className="slds-spinner_container slds-is-fixed">
        <div role="status" className="slds-spinner slds-spinner_medium">
          <span className="slds-assistive-text">Loading</span>
          <div className="slds-spinner__dot-a"></div>
          <div className="slds-spinner__dot-b"></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
