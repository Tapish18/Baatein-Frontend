import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const NotFoundPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, []);
  return <div className="font-bold">NotFoundPage</div>;
};

export default NotFoundPage;
