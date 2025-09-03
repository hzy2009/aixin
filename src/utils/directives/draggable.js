/**
 * 拖拽指令 - 让 Ant Design Vue Modal 组件支持拖拽功能
 * 使用方法: v-draggable
 */

let globalInitialized = false;

export const draggable = {
  mounted() {
    if (!globalInitialized) {
      initGlobalDraggable();
      globalInitialized = true;
    }
  },
  
  updated() {
    if (!globalInitialized) {
      initGlobalDraggable();
      globalInitialized = true;
    }
  }
};

function initGlobalDraggable() {
  // 使用事件委托在 document 上监听所有模态框的拖拽
  let isDragging = false;
  let currentModal = null;
  let currentHeader = null;
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

  // 设置transform
  const setTransform = (element, x, y) => {
    element.style.transform = `translate(${x}px, ${y}px)`;
  };

  // 鼠标按下事件
  const handleMouseDown = (e) => {
    const header = e.target.closest('.ant-modal-header');
    if (!header) return;
    
    // 如果点击的是关闭按钮，不执行拖拽
    if (e.target.closest('.ant-modal-close')) return;
    
    const modal = header.closest('.ant-modal-wrap')?.querySelector('.ant-modal');
    if (!modal) return;

    e.preventDefault();
    isDragging = true;
    currentModal = modal;
    currentHeader = header;
    startX = e.clientX;
    startY = e.clientY;
    initialTransform = getTransform(modal);
    
    // 设置样式
    header.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    
    console.log('开始拖拽', { modal, header });
  };

  // 鼠标移动事件
  const handleMouseMove = (e) => {
    if (!isDragging || !currentModal) return;
    
    e.preventDefault();
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    setTransform(
      currentModal,
      initialTransform.x + deltaX,
      initialTransform.y + deltaY
    );
  };

  // 鼠标松开事件
  const handleMouseUp = () => {
    if (!isDragging) return;
    
    isDragging = false;
    
    if (currentHeader) {
      currentHeader.style.cursor = 'grab';
    }
    
    document.body.style.userSelect = '';
    currentModal = null;
    currentHeader = null;
    
    console.log('结束拖拽');
  };

  // 绑定全局事件
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  // 定期检查新的模态框并设置样式
  const checkModals = () => {
    const headers = document.querySelectorAll('.ant-modal-header:not([data-drag-init])');
    headers.forEach(header => {
      header.setAttribute('data-drag-init', 'true');
      header.style.cursor = 'grab';
      header.style.userSelect = 'none';
      console.log('初始化模态框拖拽', header);
    });
  };

  // 立即检查
  checkModals();
  
  // 定期检查新的模态框
  setInterval(checkModals, 500);
}

export default draggable;