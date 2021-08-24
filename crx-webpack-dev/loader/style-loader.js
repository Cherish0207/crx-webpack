function loader(source) {
  console.log("style");
  let style = `
  let style = document.createElement('style')
  style.innerHTML = ${JSON.stringify(source)}
  document.head.appendChild(style);`;

  return style;
}
module.exports = loader;
