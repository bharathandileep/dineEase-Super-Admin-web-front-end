interface DownloadFile {
  data: any;
  filename: string;
  mime: any;
  bom: any;
}

export const downloadFile = ({ data, filename, mime, bom }: DownloadFile) => {
  var blobData = typeof bom !== "undefined" ? [bom, data] : [data];
  var blob = new Blob(blobData, { type: mime || "application/octet-stream" });

  var blobURL =
    window.URL && window.URL.createObjectURL
      ? window.URL.createObjectURL(blob)
      : window.webkitURL.createObjectURL(blob);
  var tempLink = document.createElement("a");
  tempLink.style.display = "none";
  tempLink.href = blobURL;
  tempLink.setAttribute("download", filename);

  // Safari thinks _blank anchor are pop ups. We only want to set _blank
  // target if the browser does not support the HTML5 download attribute.
  // This allows you to download files in desktop safari if pop up blocking
  // is enabled.
  if (typeof tempLink.download === "undefined") {
    tempLink.setAttribute("target", "_blank");
  }
  document.body.appendChild(tempLink);
  tempLink.click();

  // Fixes "webkit blob resource error 1"
  setTimeout(function () {
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }, 200);
};

// utils/dateFormatter.js
export function formatDateToDDMMYY(dateString: any) {
  if (!dateString) return "";

  const date: any = new Date(dateString);
  if (isNaN(date)) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}

export const getAccessDetailsFromLocalStorage = () => {
  const data = localStorage.getItem("accessDetails");
  return data ? JSON.parse(data) : null;
};

// utils/contextStorage.ts

export type ContextType = "Organization" | "Kitchen" | "Admin";

export interface Context {
  contextId: string | number;
  contextType: ContextType;
  slug: String;
}

const CONTEXT_KEY = "context";

/**
 * Save selected context to localStorage
 */
export function setContext(context: Context): void {
  try {
    localStorage.setItem(CONTEXT_KEY, JSON.stringify(context));
  } catch (err) {
    console.error("Failed to save context", err);
  }
}

/**
 * Get context from localStorage
 */
export function getContext(): Context | null {
  try {
    const context = localStorage.getItem(CONTEXT_KEY);
    return context ? (JSON.parse(context) as Context) : null;
  } catch (err) {
    console.error("Failed to parse context", err);
    return null;
  }
}

/**
 * Clear context from localStorage
 */
export function clearContext(): void {
  try {
    localStorage.removeItem(CONTEXT_KEY);
  } catch (err) {
    console.error("Failed to remove context", err);
  }
}
