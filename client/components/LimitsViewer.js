import React from "react";
import Spinner from "./Spinner.js";
import CProgressBar from "react-customizable-progressbar";

const ProgressBar = (props) => {
  const { Max, Remaining } = props.data;
  const percentage = Max == 0 ? 0 : ((Max - Remaining) / Max) * 100;

  return (
    <div>
      <div className="text">
        {Remaining} / {Max}
      </div>
      <CProgressBar
        radius={100}
        progress={`${percentage.toFixed(0)}`}
        strokeWidth={18}
        strokeColor="#5d9cec"
        strokeLinecap="square"
        trackStrokeWidth={18}
      >
        <div className="indicator">
          <div>{`${percentage.toFixed(0)}`}%</div>
        </div>
      </CProgressBar>
    </div>
  );
};

const UsageProgressBar = (props) => {
  const { data } = props;

  return (
    <div style={{ width: "30%", margin: "5px", textAlign: "-webkit-center" }}>
      <h4>{props.title}</h4>
      <ProgressBar data={data} />
    </div>
  );
};

export default function LoginPanel({ limits }) {
  if (!limits) {
    return (
      <center>
        <span style={{ fontWeight: "bold" }}>
          <Spinner />
        </span>
      </center>
    );
  }

  const data = limits;

  return (
    <div>
      <center>
        <span style={{ fontWeight: "bold", fontSize: "large" }}>
          Limits Viewer
        </span>
      </center>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {Object.entries(data).map(([key, value]) => (
          <UsageProgressBar key={key} title={key} data={value} />
        ))}
      </div>

      <style>{`
        .indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          margin: 0 auto;
          font-size: 2.2em;
          font-weight: 100;
          color: #555;
          user-select: none;
        }
      `}</style>
    </div>
  );
}
