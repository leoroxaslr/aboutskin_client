import React, { useState, useEffect } from "react";

function Toast({ message, onClose }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-4 shadow-xl transition-opacity delay-200 ${
        show ? "opacity-100" : "opacity-0"
      }${show ? "visible" : "invisible"} transition-all duration-400`}
    >
      {message}
    </div>
  );
}

export default Toast;
