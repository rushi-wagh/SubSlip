import React from "react";

const AppLayout = ({ children }) => {
  return (
    <>
      <div className="w-screen h-fit relative overflow-x-hidden">{children}</div>
    </>
  );
};

export default AppLayout;
