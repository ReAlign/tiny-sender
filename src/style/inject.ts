export default function injectStyle(styles: string) {
  const styleElement: HTMLStyleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}
