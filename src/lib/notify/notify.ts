import {
  uuidMaker,
  injectStyle
} from './util';
import dom from './dom';
import notifyStyles from './style/notify.less';

class Notify {
  msg: any;
  status: any;
  delay: any;
  ele: any;
  hideTimer: any;
  clsMain: string;
  clsNone: string;
  clsIn: string;
  DELAY: { in: number; aniTime: number; };
  constructor(options: any = {}) {
    const {
      msg, // 文案
      status, // 状态
      delay, // 持续时间
    } = options;
    this.msg = msg || 'errorMsg';
    this.status = status || 'error';
    this.delay = delay || 3000;
    this.ele = null;
    this.hideTimer = null;

    this.clsMain = 'm-ts-notify';
    this.clsNone = 'u-none';
    this.clsIn = 'u-in';

    this.DELAY = {
      in: 10,
      aniTime: 300,
    };

    this.main();
  }
  main() {
    this.injectStyle();
    this.createDom();
    this.show();
  }
  injectStyle() {
    injectStyle(notifyStyles);
  }
  createDom() {
    const self = this;

    self.ele = document.createElement('div');
    self.ele.id = uuidMaker(new Date);
    self.ele.innerHTML = `
      <span class="u-notify-icon icon-${self.status}"></span>
      <span class="u-msg">${self.msg}</span>
    `;

    self.ele.className = `${self.clsMain} ${self.clsNone} u-${self.status}`;
    document.body.appendChild(self.ele);

    self.ele.addEventListener('mouseenter', () => {
      self.delHider();
    }, false);
    self.ele.addEventListener('mouseleave', () => {
      self.addHider();
    }, false);
  }
  show() {
    const self = this;

    dom.delClass(self.ele, self.clsNone);

    setTimeout(() => {
      dom.addClass(self.ele, self.clsIn);

      self.addHider();
    }, this.DELAY.in);
  }
  hide() {
    const self = this;
    dom.delClass(self.ele, self.clsIn);

    setTimeout(() => {
      self.ele.style.display = 'none';
      self.remove();
    }, self.DELAY.aniTime);
  }
  remove() {
    document.body.removeChild(this.ele);
  }

  addHider() {
    const self = this;

    self.hideTimer = setTimeout(() => {
      self.hide();
    }, self.delay);
  }
  delHider() {
    const self = this;

    clearTimeout(self.hideTimer);
    self.hideTimer = null;
  }
}

export function tips(msg, status, delay) {
  new Notify({ msg, status, delay });
}
export function success(msg = '请求成功') {
  tips(msg, 'success', 3000);
}
export function error(msg = '服务器异常，请稍后再试') {
  tips(msg, 'error', 3000);
}
