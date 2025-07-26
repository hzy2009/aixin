import { ref } from 'vue';
import defHttp from '@/utils/http/axios'
import { message } from 'ant-design-vue';

export function useTodo (config) {
    const loading = ref(false);
    const modalTitle =  ref('填写信息获取交易信息');
    const actionText =  ref('联系平台获取最新进展');

    const handleSubmit = async (url, data) => {
        loading.value = true;
        try {
            const res = await defHttp.post({url, data});
            if (res.success) {
                message.success(res.message);
            } else {
                message.error(res.message);
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        handleSubmit,
        modalTitle,
        actionText
    }
}