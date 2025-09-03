/**
 * 全局模态框拖拽功能
 * 自动为所有 Ant Design Vue Modal 添加拖拽功能
 */

let initialized = false;

export function initModalDrag() {
  if (initialized) return;
  initialized = true;

  let isDragging = false;
  let currentModal = null;
  let startX = 0;
  let startY = 0;
  let initialTransform = { x: 0, y: 0 };

  // 获取当前transform值
  const getTransform = (element) => {
    const transform = element.style.transform || '';
    const translateMatch = transform.match(/translate\(([^)]+)\)/);
    if (translateMatch) {
      const values = translateMatch[1].split(',').map(v => parseFloat(v.trim()));
      return { x: values[0] || 0, y: values[1] || 0 };
    }
    return { x: 0, y: 0 };
  };

  // 设置transform，带边界限制
  const setTransform = (element, x, y) => {
    // 先应用变换，然后获取实际位置进行边界检查
    element.style.transform = `translate(${x}px, ${y}px)`;
    const currentRect = element.getBoundingClientRect();
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const minVisibleArea = 100; // 至少保留100px可见区域
    const headerHeight = 50; // 标题栏高度
    
    let adjustedX = x;
    let adjustedY = y;
    
    // 左边界检查：模态框右边缘至少保留minVisibleArea在屏幕内
    if (currentRect.right < minVisibleArea) {
      adjustedX = x + (minVisibleArea - currentRect.right);
    }
    
    // 右边界检查：模态框左边缘至少保留minVisibleArea在屏幕内
    if (currentRect.left > viewportWidth - minVisibleArea) {
      adjustedX = x - (currentRect.left - (viewportWidth - minVisibleArea));
    }
    
    // 顶边界检查：模态框顶部不能超出屏幕
    if (currentRect.top < 0) {
      adjustedY = y - currentRect.top;
    }
    
    // 底边界检查：至少保留标题栏高度在屏幕内
    if (currentRect.bottom > viewportHeight - headerHeight) {
      adjustedY = y - (currentRect.bottom - (viewportHeight - headerHeight));
    }
    
    // 如果需要调整，重新应用变换
    if (adjustedX !== x || adjustedY !== y) {
      element.style.transform = `translate(${adjustedX}px, ${adjustedY}px)`;
      
      // 调试信息
      console.log('🔒 边界限制生效', { 
        requested: { x, y }, 
        adjusted: { x: adjustedX, y: adjustedY },
        modalRect: { 
          left: currentRect.left, 
          right: currentRect.right, 
          top: currentRect.top,
          bottom: currentRect.bottom,
          width: currentRect.width,
          height: currentRect.height
        },
        viewport: { width: viewportWidth, height: viewportHeight }
      });
    }
  };

  // 鼠标按下事件处理
  const handleMouseDown = (e) => {
    // 检查是否点击的是模态框标题栏
    const header = e.target.closest('.ant-modal-header');
    if (!header) return;
    
    // 如果点击的是关闭按钮，不执行拖拽
    if (e.target.closest('.ant-modal-close')) return;
    
    // 查找对应的模态框
    const modalWrap = header.closest('.ant-modal-wrap');
    const modal = modalWrap?.querySelector('.ant-modal');
    if (!modal) return;

    e.preventDefault();
    e.stopPropagation();
    
    isDragging = true;
    currentModal = modal;
    startX = e.clientX;
    startY = e.clientY;
    initialTransform = getTransform(modal);
    
    // 设置拖拽时的样式
    header.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
    
    console.log('🎯 开始拖拽模态框', { modal, header, initialTransform });
  };

  // 鼠标移动事件处理
  const handleMouseMove = (e) => {
    if (!isDragging || !currentModal) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    const newX = initialTransform.x + deltaX;
    const newY = initialTransform.y + deltaY;
    
    setTransform(currentModal, newX, newY);
  };

  // 鼠标松开事件处理
  const handleMouseUp = () => {
    if (!isDragging) return;
    
    isDragging = false;
    
    // 恢复样式
    const headers = document.querySelectorAll('.ant-modal-header[data-drag-ready]');
    headers.forEach(header => {
      header.style.cursor = 'grab';
    });
    
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    currentModal = null;
    
    console.log('✅ 结束拖拽');
  };

  // 检查并初始化新的模态框
  const initializeModals = () => {
    const headers = document.querySelectorAll('.ant-modal-header:not([data-drag-ready])');
    
    headers.forEach(header => {
      header.setAttribute('data-drag-ready', 'true');
      header.style.cursor = 'grab';
      header.style.userSelect = 'none';
      
      // 设置标题文字不可选中，但保留关闭按钮的交互
      const title = header.querySelector('.ant-modal-title');
      if (title) {
        title.style.userSelect = 'none';
        title.style.pointerEvents = 'none';
      }
      
      const closeBtn = header.querySelector('.ant-modal-close');
      if (closeBtn) {
        closeBtn.style.pointerEvents = 'auto';
      }
      
      console.log('🚀 初始化模态框拖拽功能', header);
    });
  };

  // 绑定全局事件
  document.addEventListener('mousedown', handleMouseDown, true);
  document.addEventListener('mousemove', handleMouseMove, true);
  document.addEventListener('mouseup', handleMouseUp, true);

  // 立即检查现有模态框
  initializeModals();

  // 使用 MutationObserver 监听 DOM 变化
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        // 检查是否有新增的节点包含模态框
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList?.contains('ant-modal-wrap') || 
                node.querySelector?.('.ant-modal-wrap')) {
              shouldCheck = true;
            }
          }
        });
      }
    });
    
    if (shouldCheck) {
      // 延迟执行，确保 DOM 完全渲染
      setTimeout(initializeModals, 100);
    }
  });

  // 开始观察
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('🎨 全局模态框拖拽功能已启用');
}