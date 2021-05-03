const dom: any = {};

dom.addClass = function (node, className) {
  const current = node.className || '';

  if (` ${current} `.indexOf(` ${className} `) === -1) {
    node.className = current ? `${current} ${className}` : className;
  }
}

dom.delClass = function (node, className) {
  const current = node.className || '';

  node.className = ` ${current} `.replace(` ${className} `, ' ').trim();
}

dom.hasClass = function (node, className) {
  const current = node.className || '';

  return ` ${current} `.indexOf(` ${className} `) !== -1;
}

export default dom;
