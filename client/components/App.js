import React, { useState, useEffect } from "react";
import LoginPanel from "./LoginPanel.js";
import LogoutPanel from "./LogoutPanel.js";
import LimitsViewer from "./LimitsViewer.js";
import Spinner from "./Spinner.js";

const WHOAMI_URL = "/auth/whoami";
const LIMITS_URL = "/limits";

export default function App() {
  const [user, setUser] = useState(null);
  const [limits, setLimits] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const handleLogin = (msg) => {
    setShowSpinner(msg);
    localStorage.setItem("loading", msg);
  };

  const fetchData = async () => {
    try {
      //fetch user
      const response = await fetchCurrentUser();
      if (response.ok) {
        const json = await response.json();

        localStorage.setItem("user", JSON.stringify(json));
        localStorage.removeItem("loading");
        setShowSpinner(false);
        //set user info
        setUser(json);
        // fetch org limit infos
        const limitsResponse = await fetchOrgLimitsInfo();
        if (limitsResponse.ok) {
          const limitsJson = await limitsResponse.json();
          //set limits
          setLimits(limitsJson);
        } else {
          console.error(
            "Failed to retrieve Org Limit info.",
            JSON.stringify(limitsResponse)
          );
        }
      } else if (response.status !== 401) {
        console.error(
          "Failed to retrieve logged user.",
          JSON.stringify(response)
        );
      } else {
        localStorage.clear();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setShowSpinner(false);

    if (localStorage.hasOwnProperty("loading")) {
      setShowSpinner(localStorage.getItem("loading"));
    }

    if (localStorage.hasOwnProperty("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }

    fetchData();

    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Get logged in user
  const fetchCurrentUser = () =>
    fetch(WHOAMI_URL, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

  // Get Limits info
  const fetchOrgLimitsInfo = () =>
    fetch(LIMITS_URL, {
      method: "get",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

  return (
    <div>
      {user == null ? (
        <LoginPanel handleLogin={handleLogin} />
      ) : (
        <div>
          Logged in as{" "}
          <span style={{ fontWeight: "bold" }}>{user.username}</span>!{" "}
          <LogoutPanel />
          <LimitsViewer limits={limits} />
        </div>
      )}
      {showSpinner && <Spinner />}
    </div>
  );
}
