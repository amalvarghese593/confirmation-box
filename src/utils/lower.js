export const lower = (str) =>
  typeof str === "string" ? str.toLowerCase().replace(/\s+/g, "") : "";
