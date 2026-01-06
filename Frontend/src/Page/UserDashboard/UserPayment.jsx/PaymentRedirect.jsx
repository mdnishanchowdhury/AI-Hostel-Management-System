import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentRedirect({ status }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/dashboard/payments?payment=${status}`, { replace: true });
  }, [status, navigate]);

  return null; 
}
