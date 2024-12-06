import logo from "./logo.svg";
import "./App.css";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Viewer from "./components/Viewer";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
// import }

function App() {
  const [buttonClicked, SetButtonClicked] = useState(false);
  const [statusIndex, setStatusIndex] = useState(-1);

  const statusMessages = [
    "Gathering and fetching element physical properties...",
    "Calculating Impact...",
    "Generating visualization...",
  ];

  useEffect(() => {
    if (buttonClicked && statusIndex < statusMessages.length) {
      const timer = setTimeout(() => {
        setStatusIndex((prevIndex) => prevIndex + 1);
      }, 2000);
      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [buttonClicked, statusIndex]);

  function openForgeViewer() {
    SetButtonClicked(true);
    setStatusIndex(0);
  }
  return (
    <div className="App">
      {!buttonClicked && (
        <Button variant="contained" onClick={openForgeViewer}>
          Calculate Impact
        </Button>
      )}
      {buttonClicked && statusIndex < statusMessages.length && (
        <>
          {/* <Button variant="contained" onClick={openForgeViewer}>
            Calculate Impact
          </Button> */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
          <p>{statusMessages[statusIndex]}</p>
          </div>
          
        </>
      )}
      {buttonClicked && statusIndex === statusMessages.length && (
        <Viewer
          file_urn={
            "urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YXBzc2ltYXByb2ludi9Qcm9qZWN0Mi5ydnQ="
          }
        ></Viewer>
      )}
    </div>
  );
}

export default App;
