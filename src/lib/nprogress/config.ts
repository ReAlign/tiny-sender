export function getConfig(TS: any) {
  const {
    barEl = 'body',
    barHeight = 4,
    barStriped = false,
  } = TS;

  const barClasses = [
    'bar',
    'u-progress',
    `bar-height-${barHeight}`,
    `${barStriped ? 'a-progress-striped' : ''}`,
    'z-act'
  ].join(' ');

  return {
    parent: barEl,
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

