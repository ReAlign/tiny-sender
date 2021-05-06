export function getConfig() {
  const barClasses = [
    'bar',
    'u-progress',
    'bar-height-4',
    'a-progress-striped',
    'z-act'
  ].join(' ');

  return {
    parent: 'body',
    showSpinner: false,
    template: `
      <div class="${barClasses}" role="bar">
        <div class="progress_bar"></div>
        <span class="u-flash-shadow"></span>
      </div>
    `
  };
}

export function injectStyle(styles: string) {
  const styleElement: HTMLStyleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}

