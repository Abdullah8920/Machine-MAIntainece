import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Builds and downloads a PDF report for one client:
 * header info, current status, and the full visit history table.
 */
export function downloadClientReport(client, history) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const current = history[0];
    const marginX = 40;
    let y = 50;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Machine Maintenance Report", marginX, y);

    y += 26;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Client: ${client.clientName}`, marginX, y);
    y += 16;
    doc.text(`Company: ${client.companyName}`, marginX, y);

    if (current) {
        y += 16;
        doc.text(`Machine: ${current.machineName}`, marginX, y);
        y += 26;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("Current Status", marginX, y);
        y += 18;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const balance = (Number(current.cost) || 0) - (Number(current.advance) || 0);
        const lines = [
            [`Date`, current.date || "-"],
            [`Status`, current.status || "-"],
            [`Defect`, current.defect || "-"],
            [`Total Cost`, `Rs ${current.cost || "-"}`],
            [`Advance Received`, `Rs ${current.advance || 0}`],
            [`Balance`, `Rs ${balance}`],
            [`Remarks`, current.remarks || "-"],
        ];
        lines.forEach(([label, value]) => {
            doc.text(`${label}: ${value}`, marginX, y);
            y += 16;
        });
        y += 8;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("History", marginX, y);
    y += 10;

    autoTable(doc, {
        startY: y,
        margin: { left: marginX, right: marginX },
        head: [["S.No", "Date", "Description", "Cost", "Advance", "Balance", "Remarks", "Status"]],
        body: history.map((r, i) => [
            i + 1,
            r.date || "-",
            r.defect || "-",
            `Rs ${r.cost || "-"}`,
            `Rs ${r.advance || 0}`,
            `Rs ${(Number(r.cost) || 0) - (Number(r.advance) || 0)}`,
            r.remarks || "-",
            r.status || "-",
        ]),
        styles: { fontSize: 8, cellPadding: 4 },
        headStyles: { fillColor: [22, 32, 42] },
    });

    const fileName = `${client.clientName.replace(/\s+/g, "-")}-report.pdf`;
    doc.save(fileName);
}