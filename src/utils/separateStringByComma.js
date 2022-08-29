export const separateStringByComma = (str, trueBlock, falseBlock) => {
  if (str.includes(",")) {
    str.split(",").forEach((item) => {
      trueBlock(item.trim());
    });
  } else {
    falseBlock(str.trim());
  }
};
