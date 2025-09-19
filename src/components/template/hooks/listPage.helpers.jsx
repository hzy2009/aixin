import { Button as AButton, Popconfirm as APopconfirm } from 'ant-design-vue';
import detailIcon from '@/assets/images/icon-detail.png';
import delIcon from '@/assets/images/icon-delete.png';

/**
 * @description 创建一个用于vxe-grid操作列的渲染器函数。
 * @param {import('vue').Ref<Array>} actions - Ref<Array> 包含操作按钮配置的对象数组。
 * @param {Function} handleActionClick - 处理通用点击事件（如“详情”）的回调函数。
 * @param {Function} handleDelete - 处理删除操作的回调函数。
 * @returns {Function} 返回一个可直接用于vxe-grid列`slots.default`的JSX渲染函数。
 */
export function createActionCellRenderer(actions, handleActionClick, handleDelete) {
    /**
     * @description 渲染带气泡确认框的删除按钮。
     * @param {Object} row - 当前行数据。
     * @param {Object} action - 当前操作的配置。
     * @param {Number} i - 索引key。
     * @returns {import('vue').VNode} JSX VNode。
     */
    const renderDeleteAction = (row, action, i) => {
        // 根据行数据状态判断按钮是否禁用
        const isDisabled = row.statusCode !== 'submit';
        return (
            <APopconfirm
                disabled={isDisabled}
                title="是否确认删除"
                ok-text="是"
                cancel-text="否"
                onConfirm={() => handleDelete(row)}
            >
                <span class="action-item">
                    <span><img src={delIcon} alt="删除" class="action-icon" /></span>
                    <AButton
                        type="link"
                        class={{ 'action-link': true, 'not-allowed': isDisabled }}
                        disabled={isDisabled}
                        key={i}
                    >
                        {action.formatText ? action.formatText(row) : action.text}
                    </AButton>
                </span>
            </APopconfirm>
        );
    };

    /**
     * @description 渲染标准的操作链接（如“详情”）。
     * @param {Object} row - 当前行数据。
     * @param {Object} action - 当前操作的配置。
     * @param {Number} i - 索引key。
     * @returns {import('vue').VNode} JSX VNode。
     */
    const renderDefaultAction = (row, action, i) => {
        return (
            <span class="action-item" onClick={() => handleActionClick(row, action)}>
                <span><img src={detailIcon} alt="详情" class="action-icon" /></span>
                <AButton type="link" class="action-link" key={i}>
                    {action.formatText ? action.formatText(row) : action.text}
                </AButton>
            </span>
        );
    };

    // 返回最终的单元格渲染器函数
    return function renderActionCell({ row }) {
        if (!actions || !Array.isArray(actions)) return null;
        // 遍历操作配置，根据类型渲染不同的按钮
        return actions.map((action, i) => {
            if (action.type === 'del') {
                return renderDeleteAction(row, action, i);
            }
            return renderDefaultAction(row, action, i);
        });
    };
}