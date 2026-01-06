import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function PaymentsAlert() {
    const [searchParams, setSearchParams] = useSearchParams();
    const paymentStatus = searchParams.get("payment");

    useEffect(() => {
        if (!paymentStatus) return;

        switch (paymentStatus) {
            case "success":
                Swal.fire({
                    icon: "success",
                    title: "Payment Successful!",
                    text: "Your payment has been completed successfully.",
                    confirmButtonColor: "#16a34a",
                });
                break;

            case "fail":
                Swal.fire({
                    icon: "error",
                    title: "Payment Failed!",
                    text: "Something went wrong. Please try again.",
                    confirmButtonColor: "#dc2626",
                });
                break;

            case "cancel":
                Swal.fire({
                    icon: "warning",
                    title: "Payment Cancelled!",
                    text: "You cancelled the payment. No charges were made.",
                    confirmButtonColor: "#ca8a04",
                });
                break;

            default:
                break;
        }

        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("payment");
        setSearchParams(newParams, { replace: true });
    }, [paymentStatus, searchParams, setSearchParams]);

    return null;
}
