"use client";

import { createContext, useContext, useState } from "react";

const alertContext = createContext({});

export const alertProvider = ({ children }) => {
  const [alerts, setalerts] = useState([]);

  const alert = ({
    title,
    description,
    variant = "default",
    duration = 5000,
  }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newalert = { id, title, description, variant, duration };

    setalerts((prevalerts) => [...prevalerts, newalert]);

    if (duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        setalerts((prevalerts) =>
          prevalerts.filter((alert) => alert.id !== id)
        );
      }, duration);
    }

    return id;
  };

  const dismiss = (id) => {
    setalerts((prevalerts) => prevalerts.filter((alert) => alert.id !== id));
  };

  return (
    <alertContext.Provider value={{ alert, dismiss, alerts }}>
      {children}
    </alertContext.Provider>
  );
};

export const usealert = () => {
  const context = useContext(alertContext);

  if (context === undefined) {
    throw new Error("usealert must be used within a alertProvider");
  }

  return context;
};
