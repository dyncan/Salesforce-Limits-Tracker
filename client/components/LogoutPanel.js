import React, { useState } from "react";

export default function LoginPanel() {
  const logout = () => {
    localStorage.clear();
    window.location = "/auth/logout";
  };

  return (
    <div className="slds-col slds-no-flex slds-grid">
      <button onClick={logout} className="slds-button slds-button--neutral">
        <svg
          aria-hidden="true"
          className="slds-button__icon--stateful slds-button__icon--left"
        >
          <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#logout"></use>
        </svg>
        Log out
      </button>
    </div>
  );
}
