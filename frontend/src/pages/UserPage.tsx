import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserPage.css";
import BottomNav from "../components/BottomNav";

export const UserPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/reservas");
  }, [navigate]);

  return (
    <>
      <BottomNav />
    </>
  );
};


