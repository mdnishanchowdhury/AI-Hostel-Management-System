import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generatePaymentPDF = ({ payment, profile, user }) => {
    try {
        const doc = new jsPDF("p", "mm", "a4");

        doc.addImage(
            "https://i.ibb.co/Kc123MHc/GUBNew-Logo-removebg-preview.png",
            "PNG",
            22,
            15,
            70,
            25
        );

        doc.addImage(
            "https://i.ibb.co/zWxX6ddQ/Chat-GPT-Image-Jan-16-2026-02-30-05-AM.png",
            "PNG",
            120,
            2,
            80,
            53
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text("Payment Receipt", 105, 52, { align: "center" });

        doc.setLineWidth(0.8);
        doc.line(20, 56, 190, 56);

        doc.setFontSize(11);

        const y = 66;
        const gap = 8;

        doc.text("Name", 20, y);
        doc.text(`: ${profile?.name || "-"}`, 65, y);

        doc.text("Student ID", 20, y + gap);
        doc.text(`: ${profile?.studentId || "-"}`, 65, y + gap);

        doc.text("Email", 20, y + gap * 2);
        doc.text(`: ${user?.email || "-"}`, 65, y + gap * 2);

        doc.text("Payment Month", 20, y + gap * 3);
        doc.text(
            `: ${new Date(payment.month + "-01").toLocaleString("default", {
                month: "long",
                year: "numeric",
            })}`,
            65,
            y + gap * 3
        );

        autoTable(doc, {
            startY: y + gap * 5,
            theme: "striped",
            styles: {
                fontSize: 11,
            },
            headStyles: {
                fillColor: [0, 102, 51],
                textColor: 255,
                halign: "center",
            },
            bodyStyles: {
                halign: "center",
            },
            columnStyles: {
                0: { halign: "left" },
            },
            head: [["Description", "Amount (BDT)"]],
            body: [
                ["Room Rent", payment.roomRent ?? 0],
                ["Meal Cost", payment.mealCost ?? 0],
                ["Total Paid", payment.amount ?? 0],
            ],
        });

        const afterTableY = doc.lastAutoTable.finalY + 10;

        doc.text("Payment Method", 20, afterTableY);
        doc.text(`: ${payment.method || "-"}`, 65, afterTableY);

        doc.text("Paid At", 20, afterTableY + 8);
        doc.text(
            `: ${payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "-"
            }`,
            65,
            afterTableY + 8
        );

        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 128, 0);
        doc.text("STATUS: PAID", 20, afterTableY + 22);
        doc.setTextColor(0, 0, 0);

        doc.save(`GUB-Hostel-Payment-Receipt-${payment.month}.pdf`);
    } catch (error) {
        console.error("PDF Error:", error);
        alert("PDF download failed");
    }
};

export default generatePaymentPDF;
