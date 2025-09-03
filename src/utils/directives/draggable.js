/**
 * 拖拽指令 - 让 Ant Design Vue Modal 组件支持拖拽功能
 * 使用方法: v-draggable
 * 
 * 特性:
 * - 通过标题栏拖拽移动模态框
 * - 自动处理鼠标状态和样式
 * - 模态框关闭时重置位置
 */

export const draggable = {
  mounted(el) {
    // 添加数据属性标记，用于CSS样式定位
    el.setAttribute('data-draggable', 'true');
    
    // 等待 DOM 完全渲染
    setTimeout(() => {
      initDraggable(el);
    }, 100);
  },
  
  updated(el) {
    // 确保数据属性存在
    if (!el.hasAttribute('data-draggable')) {
      el.setAttribute('data-draggable', 'true');
    }
    
    // 每次组件更新时重新初始化拖拽功能
    setTimeout(() => {
      initDraggable(el);
    }, 100);
  },
  
  unmounted(el) {
    // 清理数据属性
    el.removeAttribute('data-draggable');
  }
};

function initDraggable(wrapperEl) {
  // 查找模态框元素和标题栏元素
  const modalElement = wrapperEl.querySelector('.ant-modal');
  const titleElement = wrapperEl.querySelector('.ant-modal-header');
  
  if (!modalElement || !titleElement) {
    return;
  }

  // 避免重复绑定事件
  if (titleElement.dataset.draggableInitialized) {
    return;
  }
  
  titleElement.dataset.draggableInitialized = 'true';

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialTransform = { x: 0, y: 0 };

  // 获取当前transform值
  const getTransform = () => {
    const transform = modalElement.style.transform || '';
    const translateMatch = transform.match(/translate\(([^)]+)\)/);
    if (translateMatch) {
      const values = translateMatch[1].split(',').map(v => parseFloat(v.trim()));
      return { x: values[0] || 0, y: values[1] || 0 };
    }
    return { x: 0, y: 0 };
  };

  // 设置transform
  const setTransform = (x, y) => {
    modalElement.style.transform = `translate(${x}px, ${y}px)`;
  };

  // 鼠标按下事件
  const handleMouseDown = (e) => {
    // 只有点击标题栏区域才能拖拽，避免点击关闭按钮时也触发拖拽
    if (e.target.closest('.ant-modal-close')) {
      return;
    }
    
    e.preventDefault();
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialTransform = getTransform();
    
    titleElement.style.cursor = 'grabbing';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 鼠标移动事件
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    setTransform(
      initialTransform.x + deltaX,
      initialTransform.y + deltaY
    );
  };

  // 鼠标松开事件
  const handleMouseUp = () => {
    if (!isDragging) return;
    
    isDragging = false;
    titleElement.style.cursor = 'grab';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // 设置标题栏样式
  titleElement.style.cursor = 'grab';
  titleElement.style.userSelect = 'none';
  
  // 绑定事件
  titleElement.addEventListener('mousedown', handleMouseDown);

  // 观察模态框是否被移除，用于重置位置
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
        // 检查是否移除了模态框
        for (let node of mutation.removedNodes) {
          if (node === modalElement || (node.contains && node.contains(modalElement))) {
            // 模态框被移除，重置位置
            if (modalElement.style) {
              modalElement.style.transform = '';
            }
            observer.disconnect();
            break;
          }
        }
      }
    });
  });

  // 观察整个文档的变化
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

export default draggable;