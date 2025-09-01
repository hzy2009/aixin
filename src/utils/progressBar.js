/**
 * 顶部进度条工具类
 * 用于路由跳转时显示页面加载进度
 */
class ProgressBar {
  constructor(options = {}) {
    this.element = null;
    this.isLoading = false;
    this.timer = null;
    this.options = {
      color: '#BC1A2C', // 使用项目主色调
      height: '2px',
      duration: 300,
      ...options
    };
    
    this.createProgressBar();
  }

  // 创建进度条元素
  createProgressBar() {
    if (this.element) return;

    this.element = document.createElement('div');
    this.element.id = 'top-progress-bar';
    this.element.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: ${this.options.height};
      background-color: ${this.options.color};
      z-index: 9999;
      transition: width ${this.options.duration}ms ease-out, opacity 200ms ease;
      opacity: 0;
      box-shadow: 0 0 8px ${this.options.color};
    `;

    document.body.appendChild(this.element);
  }

  // 开始进度条
  start() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.element.style.opacity = '1';
    this.element.style.width = '0%';

    // 模拟加载进度
    let progress = 0;
    const increment = () => {
      progress += Math.random() * 10;
      if (progress > 90) {
        progress = 90;
      }
      
      this.element.style.width = `${progress}%`;
      
      if (progress < 90 && this.isLoading) {
        this.timer = setTimeout(increment, 100 + Math.random() * 200);
      }
    };

    increment();
  }

  // 完成进度条
  finish() {
    if (!this.isLoading) return;
    
    this.isLoading = false;
    
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.element.style.width = '100%';
    
    setTimeout(() => {
      this.element.style.opacity = '0';
      setTimeout(() => {
        if (this.element) {
          this.element.style.width = '0%';
        }
      }, 200);
    }, this.options.duration);
  }

  // 失败时的处理
  error() {
    if (!this.isLoading) return;
    
    this.element.style.backgroundColor = '#ff4d4f'; // 错误时显示红色
    this.finish();
    
    // 重置颜色
    setTimeout(() => {
      this.element.style.backgroundColor = this.options.color;
    }, 500);
  }

  // 销毁进度条
  destroy() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    }
    
    this.isLoading = false;
  }
}

// 创建全局实例
const progressBar = new ProgressBar();

export default progressBar;