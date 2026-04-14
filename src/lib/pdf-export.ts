export async function generatePDF(resumeText: string): Promise<Buffer> {
  // Simple PDF generation using text content
  // In production, consider using @react-pdf/renderer or puppeteer for richer formatting
  const PDFDocument = (await import("pdfkit")).default;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    const chunks: Uint8Array[] = [];
    doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Parse resume text and format
    const lines = resumeText.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed) {
        doc.moveDown(0.5);
        continue;
      }

      // Detect headers (all caps or short lines)
      if (
        trimmed === trimmed.toUpperCase() &&
        trimmed.length < 60 &&
        trimmed.length > 1
      ) {
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(trimmed)
          .moveDown(0.3);
      } else if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
        doc
          .fontSize(10)
          .font("Helvetica")
          .text(trimmed, { indent: 20 });
      } else {
        doc.fontSize(10).font("Helvetica").text(trimmed);
      }
    }

    doc.end();
  });
}
