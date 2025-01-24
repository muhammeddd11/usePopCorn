import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import StarRating from "./StarRating";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      messages={["Terrible", "Bad", "Not Bad", "Okay", "Amazing"]}
      defaultReating={3}
    />
    <StarRating maxRating={24} color="red" size={100} /> */}
  </React.StrictMode>
);
