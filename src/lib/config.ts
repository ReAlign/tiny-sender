import TinySender from '@/index';

export function getNumber(val) {
  return parseInt(val) || 4;
}

export function NProgressConfig(TS: TinySender) {
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

export default {};
