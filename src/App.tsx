import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { RouterProvider } from "react-router";
import { routes } from "./routes";

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
