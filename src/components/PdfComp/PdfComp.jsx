import { useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

function PdfComp(props) {
  const [numPages, setNumPages] = useState();
  const pageNumber = 1;

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-div">
      <p style={{fontSize: "20px", fontWeight: "bold", marginBottom: "20px"}}>
        Page {pageNumber} of {numPages}
      </p>
      {/* <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map((page) => {
            return (
              <Page
                pageNumber={page}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            );
          })}
      </Document> */}
        <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
    </div>
  );
}
export default PdfComp;
