declare module 'pdfjs-dist' {
  export * from 'pdfjs-dist/types/src/pdf';
}

declare module 'pdfjs-dist/build/pdf.worker.mjs' {
  const worker: any;
  export default worker;
}
