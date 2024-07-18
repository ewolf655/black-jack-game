export const colorChecker = (hex) => {
  // Hex to RGB color
  let hexArr = hex.split("");
  hexArr.shift();
  hexArr = hexArr.join("").match(/.{1,2}/g);

  const rgb = [
    parseInt(hexArr[0], 16),
    parseInt(hexArr[1], 16),
    parseInt(hexArr[2], 16),
  ];

  // Checking if one rgb value is too dark
  return rgb.some((val) => val > 140);
};
