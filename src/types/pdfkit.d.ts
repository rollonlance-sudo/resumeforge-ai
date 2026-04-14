declare module "pdfkit" {
  class PDFDocument {
    constructor(options?: Record<string, unknown>);
    pipe(destination: NodeJS.WritableStream): this;
    fontSize(size: number): this;
    font(name: string): this;
    text(text: string, options?: Record<string, unknown>): this;
    moveDown(lines?: number): this;
    addPage(): this;
    end(): void;
    on(event: string, listener: (...args: never[]) => void): this;
  }
  export = PDFDocument;
}
