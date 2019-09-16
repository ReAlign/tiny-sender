const config = {};

config.getNumber = (val) => parseInt(val) || 4;

config.NProgressConfig = (obj = {}) => {
    const {
        barEl = 'body',
        barHeight = 4,
        barStriped = false,
    } = obj;

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
};

export default config;