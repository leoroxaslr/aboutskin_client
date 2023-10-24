import React from "react";

const AdminDash = () => {
  return (
    <>
      <div className="stats bg-base-100 text-primary-content">
        <div className="stat">
          <div className="stat-title">Total Sales</div>
          <div className="stat-value">$89,400</div>
        </div>

        <div className="stat">
          <div className="stat-title">Current balance</div>
          <div className="stat-value">$89,400</div>
        </div>
      </div>
    </>
  );
};

export default AdminDash;
