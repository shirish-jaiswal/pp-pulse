// utils/process-editor-html.ts

export function processEditorHtml(): string | null {
  // 1. Locate the editor wrapper in the DOM. 
  // Replace '.tiptap', '.ql-editor', or your custom class/ID with your actual editor class name.
  const editorElement = document.querySelector(".tiptap") || document.querySelector("[contenteditable='true']");
  
  if (!editorElement) {
    console.error("Editor element not found in the DOM.");
    return null;
  }

  // 2. Clone the element's HTML content safely to parse it
  const rawHtml = editorElement.innerHTML;
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, "text/html");

  const isGameElement = (el: HTMLElement | null): boolean => {
    if (!el) return false;
    return (
      el.hasAttribute("data-game-block") ||
      el.getAttribute("data-game-block") === "true" ||
      !!el.closest('[data-game-block="true"]') ||
      !!el.closest('[data-game-block]')
    );
  };

  const standardTables = Array.from(doc.querySelectorAll("table")).filter((t) => !isGameElement(t));
  const standardThs = Array.from(doc.querySelectorAll("th")).filter((th) => !isGameElement(th));
  const standardTds = Array.from(doc.querySelectorAll("td")).filter((td) => !isGameElement(td));

  // Style Tables
  standardTables.forEach((table) => {
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";
    table.style.fontFamily = "Arial, sans-serif";
    table.style.fontSize = "13px";
  });

  // Style Headers
  standardThs.forEach((th) => {
    th.style.border = "1px solid #000000";
    th.style.background = "#f3f4f6";
    th.style.padding = "10px 14px";
    th.style.textAlign = "left";
    th.style.fontWeight = "600";
    th.style.whiteSpace = "nowrap";
    th.style.fontFamily = "Arial, sans-serif";
    th.style.fontSize = "13px";
  });

  // Style Cells
  standardTds.forEach((td) => {
    td.style.border = "1px solid #000000";
    td.style.padding = "10px 14px";
    td.style.verticalAlign = "top";
    td.style.lineHeight = "1.5";
    td.style.whiteSpace = "pre-wrap";
    td.style.maxWidth = "500px";
    td.style.wordBreak = "break-word";
    td.style.fontFamily = "Arial, sans-serif";
    td.style.fontSize = "13px";

    const isNumeric = /^[\s]*?-?[\d,.]+(?:\s?[A-Z]{3})?[\s]*?$/.test(td.textContent || "");
    if (isNumeric) {
      td.style.textAlign = "right";
    }
  });

  // Set Attributes
  Array.from(doc.querySelectorAll<HTMLElement>("*")).forEach((el) => {
    const bg = el.style.backgroundColor;
    if (bg && bg !== "transparent") {
      el.setAttribute("bgcolor", bg);
      if (!isGameElement(el)) {
        el.style.background = bg;
      }
    }
  });

  const processedHtml = doc.body.innerHTML.trim();

  return `
    <html>
      <head>
        <meta charset="utf-8" />
      </head>
      <body>
        ${processedHtml}
      </body>
    </html>
  `.trim();
}