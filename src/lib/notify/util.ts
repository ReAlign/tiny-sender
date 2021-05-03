export function uuidMaker(date = new Date()) {
  const prefix = 'ts-xhr';
  const formatDate = date.toLocaleDateString().split('/').join('_');
  const random = Math.ceil(Math.random() * 1000);

  return `${prefix}-${formatDate}-${random}`;
}

export function injectStyle(styles: string) {
  const styleElement: HTMLStyleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}
