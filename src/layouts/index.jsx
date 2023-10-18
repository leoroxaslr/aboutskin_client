import React from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Routes, Route } from "react-router-dom";
import routes from "../routes";

const index = () => {
  return (
    <>
      <Header />
      <Routes>
        {routes.map((route, index) => {
          if (route.children?.length) {
            return (
              <Route
                key={index}
                path={route.path}
                element={route.element}
                exact
              >
                {route.children.map((childRoute, childIndex) => {
                  return (
                    <Route
                      key={childIndex}
                      path={childRoute.path}
                      element={childRoute.element}
                      exact
                    />
                  );
                })}
              </Route>
            );
          }
          return (
            <Route
              key={index}
              path={route.path}
              element={route.element}
              exact
            />
          );
        })}
      </Routes>
      <Footer />
    </>
  );
};

export default index;
