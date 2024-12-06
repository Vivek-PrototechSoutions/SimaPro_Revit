/* global Autodesk, THREE */
import React, { useEffect } from "react";
import "./Viewer.css";
import Helpers from "../Viewer-Helper/Viewer-Helper";

export default function Viewer(props) {
  console.log(props.file_urn);

  let urn = props.file_urn;
  useEffect(() => {
    console.log("in viewer component");
    Helpers.launchViewer("forgeViewer", urn);
  }, []);
  return (
    <div>
      {/* <div
        id="heatmap-colors"
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "white",
          zIndex: 10, // Higher z-index to appear above the viewer
          padding: "5px", // Optional for better appearance
          border: "1px solid #ccc", // Optional for better appearance
          borderRadius: "5px", // Optional for better appearance
        }}
      >
        Heatmap Legend
      </div> */}
      <div
        id="forgeViewer"
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
        }}
      ></div>
    </div>
  );
}
