import React, { useState } from "react";
import Spinner from "./Spinner.js";

export default function LoginPanel(props) {
  const [showSpinner, setShowSpinner] = useState(false);

  const login = () => {
    setShowSpinner(true);
    props.handleLogin(true);
    window.location = "/auth/login";
  };

  return (
    <section
      role="dialog"
      className="slds-modal slds-fade-in-open slds-modal_small"
      aria-modal="true"
    >
      {/* {showSpinner && <Spinner />} */}

      <div className="slds-modal__container">
        <div className="slds-modal__content">
          <div className="slds-welcome-mat slds-welcome-mat_splash">
            <div className="slds-welcome-mat__content slds-grid">
              <div className="slds-welcome-mat__info slds-size_1-of-1">
                <div className="slds-welcome-mat__info-content">
                  <div className="slds-m-bottom_x-large">
                    <img
                      className="logo slds-size_small"
                      src="./resources/icons/Salesforce.png"
                    />
                  </div>
                  <h2 className="slds-welcome-mat__info-title">
                    Welcome to the Salesforce Org Limits Viewer app.
                  </h2>
                  <div className="slds-welcome-mat__info-description slds-text-longform">
                    This app use Node.js, ReactJS, and Salesforce technology to
                    display organizational limitation in Salesforce CRM. Node.js
                    builds the backend, while ReactJS creates the user interface
                    for viewing limitation.
                  </div>
                  <div className="slds-welcome-mat__info-actions">
                    <button
                      className="slds-button slds-button_brand"
                      onClick={login}
                    >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
