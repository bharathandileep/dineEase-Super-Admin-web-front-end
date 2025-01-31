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
      <BrowserRouter  basename={process.env.PUBLIC_URL}>
        <App />
      </BrowserRouter>
      <ToastContainer
      position='top-right'
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='colored'
    />
    </React.Fragment>
  </Provider>
);
