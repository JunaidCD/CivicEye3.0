import { jsPDF } from "jspdf";

export interface TaxNoticePDFData {
  propertyAddress: string;
  penaltyAmount: string;
  penaltyType: string;
  dueDate: string;
  transactionHash: string;
  issueDate: string;
}

export class PDFGenerator {
  static async generateTaxNotice(data: TaxNoticePDFData): Promise<string> {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("TAX PENALTY NOTICE", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Property Address: ${data.propertyAddress}`, 20, 40);
    doc.text(`Penalty Type: ${data.penaltyType}`, 20, 50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Penalty Amount: ${data.penaltyAmount}`, 20, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Due Date: ${data.dueDate}`, 20, 70);
    doc.text(`Issue Date: ${data.issueDate}`, 20, 80);
    doc.text(`Transaction Hash: ${data.transactionHash}`, 20, 90);
    doc.setFontSize(10);
    doc.text("This notice was generated automatically by the CivicEye platform.", 20, 110);
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    return url;
  }

  static downloadPDF(url: string, filename: string = 'tax-notice.pdf') {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
