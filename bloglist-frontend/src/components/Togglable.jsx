import { useState, forwardRef, useImperativeHandle } from "react";

const Togglable = forwardRef(
  ({ showButtonLabel, hideButtonLabel, children }, refs) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? "none" : "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const toggleVisibility = () => {
      setVisible(!visible);
    };

    useImperativeHandle(refs, () => {
      return {
        toggleVisibility,
      };
    });

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={toggleVisibility}>{showButtonLabel}</button>
        </div>
        <div style={showWhenVisible}>
          {children}
          <button onClick={toggleVisibility}>{hideButtonLabel}</button>
        </div>
      </div>
    );
  }
);

Togglable.displayName = "Togglable";

export default Togglable;
