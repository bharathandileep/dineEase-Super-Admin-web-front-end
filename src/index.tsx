import React from "react";
import ReactDOM from "react-dom/client";

import "./i18n";
 
import App from "./App";

import { Provider } from "react-redux";
import { configureStore } from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <Provider store={configureStore({})}>
    <React.Fragment>
      <BrowserRouter>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </React.Fragment>
  </Provider>
);
