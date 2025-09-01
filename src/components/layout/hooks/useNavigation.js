import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore'; 
import { message } from 'ant-design-vue';
import defHttp from '@/utils/http/axios'; // Your Axios instance

/**
 * @typedef {Object} NavItem
 * @property {string} key - 唯一标识符
 * @property {string} label - 显示的文本
 * @property {string} [path] - 点击时导航的目标路径 (对于有 `fn` 的项可以省略)
 * @property {string[]} [matchPaths] - 定义该项应处于激活状态的路由路径前缀数组
 * @property {boolean} [exact] - 如果为 true，则 matchPaths 中的路径必须精确匹配，而非前缀匹配
 * @property {Record<string, string>} [queryParams] - 某些路径需要匹配的查询参数
 * @property {Function} [fn] - 如果此项不是链接而是执行一个操作（如弹窗），则定义此函数
 * @property {NavItem[]} [subItems] - 子菜单项数组
 */

/**
 * 管理应用导航状态的 Composable
 */
export function useNavigation() {
  const route = useRoute();

  /** @type {import('vue').Ref<NavItem[]>} */
  const navigationItems = ref([
    { 
      key: 'home', 
      label: '首页', 
      path: '/', 
      matchPaths: ['/'],
      exact: true // 确保只在根路径时才匹配
    },
    
    { 
      key: 'originalSourcing', 
      label: '原厂件寻源', 
      path: '/demands/OEMPartsSourcing', 
      matchPaths: [
        '/demands/OEMPartsSourcing',
        '/user/published/OEMPartsSourcing',
        '/user/join/OEMPartsSourcing',
        '/user/published/OEMPartsSourcing/create'
      ],
      subItems: [
        { key: 'demand_squareOEMPartsSourcing', label: '需求广场', path: '/demands/OEMPartsSourcing' },
        { key: 'publishedDomesticSourcing', label: '我发布的', path: '/user/published/OEMPartsSourcing' },
        { key: 'joinOEMPartsSourcing', label: '我参与的', path: '/user/join/OEMPartsSourcing' },
        { key: 'createOEMPartsSourcing', label: '创建原厂件寻源', path: '/user/published/OEMPartsSourcing/create' },
      ] 
    },
    { 
      key: 'secondTrade', 
      label: '二手设备', 
      path: '/secondTrade/oemParts', 
      matchPaths: [
        '/secondTrade/oemParts',
        '/secondTrade/standard',
        '/secondTrade/notStandard',
        '/secondTrade/usedEqpTrade',
        '/user/published/secondTrade',
        '/user/join/secondTrade',
      ],
      subItems: [
        {
          key: 'demandSquare',
          label: '需求广场',
          path: '/demands/secondTrade',
          subItems: [
            { key: 'oemPartsProcessing', label: '原厂件库存处理', path: '/secondTrade/oemParts'},
            { key: 'usedEqpTrade', label: '二手设备处理', path: '/secondTrade/usedEqpTrade'},
            { key: 'standard', label: '标准件库存处理', fn: () => { handleDevelopingFeature(); }},
            { key: 'notStandard', label: '非标准件库存处理', fn: () => { handleDevelopingFeature(); }},
          ]
        },
        {
          key: 'publishedSecondTrade',
          label: '我发布的',
          path: '/user/published/secondTrade',
          subItems: [
            { key: 'publishedOemParts', label: '原厂件库存处理', path: '/user/published/oemParts'},
            { key: 'publishedUsedEqp', label: '二手设备处理', path: '/user/published/usedEqpTrade'},
            { key: 'publishedStandard', label: '标准件库存处理', fn: () => { handleDevelopingFeature(); }},
            { key: 'publishedNotStandard', label: '非标准件库存处理', fn: () => { handleDevelopingFeature(); }},
          ]
        },
        {
          key: 'joinSecondTrade',
          label: '我参与的',
          path: '/user/join/secondTrade',
          subItems: [
            { key: 'joinOemParts', label: '原厂件库存处理', path: '/user/join/oemParts'},
            { key: 'joinUsedEqp', label: '二手设备处理', path: '/user/join/usedEqpTrade'},
            { key: 'joinStandard', label: '标准件库存处理', fn: () => { handleDevelopingFeature(); }},
            { key: 'joinNotStandard', label: '非标准件库存处理', fn: () => { handleDevelopingFeature(); }},
          ]
        }
      ]
    },
    { 
      key: 'tongyongcaiji', 
      label: '通用件集采',
      path: '/other/tongyongcaiji', 
      matchPaths: [
        '/other/tongyongcaiji',
      ],
      subItems: [
        { key: 'aiante', label: '爱安特', path: 'https://www.ant-fa.com', fn:() => {
          handlePurchaseClick('aian');
        }},
        { key: 'jingdongqiyegou', label: '京东工业', path: 'https://b.jd.com', fn: () =>  {
          handlePurchaseClick('jd');
        }},
         { key: 'guoptics', label: '联合光科', path: 'https://www.gu-optics.com/', fn: () =>  {
          handlePurchaseClick('guoptics');
        }},
      ]
    },
      { 
      key: 'testingValidation', 
      label: '检测验证', 
      path: '/demands/Verification', 
      matchPaths: [
        '/demands/Verification',
        '/user/published/Verification',
        '/user/join/Verification',
        '/user/published/Verification/create'
      ],
      subItems: [
        { key: 'demand_squareVerification', label: '需求广场', path: '/demands/Verification' },
        { key: 'publishedVerification', label: '我发布的', path: '/user/published/Verification' },
        { key: 'joinVerification', label: '我参与的', path: '/user/join/Verification' },
        { key: 'createVerification', label: '创建检测验证', path: '/user/published/Verification/create' },
      ]
    },
    { 
      key: 'alternativeSourcing', 
      label: '多元化寻源', 
      path: '/demands/DomesticSourcing', 
      matchPaths: [
        '/demands/DomesticSourcing',
        '/user/published/DomesticSourcing',
        '/user/join/DomesticSourcing',
        '/user/published/DomesticSourcing/create'
      ],
      subItems: [
        { key: 'demand_squareDomesticSourcing', label: '需求广场', path: '/demands/DomesticSourcing' },
        { key: 'publishedDomesticSourcing', label: '我发布的', path: '/user/published/DomesticSourcing' },
        { key: 'joinDomesticSourcing', label: '我参与的', path: '/user/join/DomesticSourcing' },
        { key: 'createDomesticSourcing', label: '创建多元化寻源', path: '/user/published/DomesticSourcing/create' },
      ] 
    },
    { 
      key: 'rndCollaboration', 
      label: '研发攻关', 
      path: '/demands/PublicRelations', 
      matchPaths: [
        '/demands/PublicRelations',
        '/user/published/PublicRelations',
        '/user/join/PublicRelations',
        '/user/published/PublicRelations/create'
      ],
      subItems: [
        { key: 'demand_squarePublicRelations', label: '需求广场', path: '/demands/PublicRelations' },
        { key: 'publishedPublicRelations', label: '我发布的', path: '/user/published/PublicRelations' },
        { key: 'joinPublicRelations', label: '我参与的', path: '/user/join/PublicRelations' },
        { key: 'createPublicRelations', label: '创建研发攻关', path: '/user/published/PublicRelations/create' },
      ] 
    },
  
    { 
      key: 'offlineEvents', 
      label: '线下活动', 
      path: '/demands/OfflineEvent', 
      matchPaths: [
        '/demands/OfflineEvent',
        '/user/published/OfflineEvent',
        '/user/join/OfflineEvent',
        '/user/published/OfflineEvent/create'
      ],
      subItems: [
        { key: 'demand_squareOfflineEvent', label: '需求广场', path: '/demands/OfflineEvent' },
        { key: 'publishedOfflineEvent', label: '我发布的', path: '/user/published/OfflineEvent' },
        { key: 'joinOfflineEvent', label: '我参与的', path: '/user/join/OfflineEvent' },
        { key: 'createOfflineEvent', label: '创建线下活动', path: '/user/published/OfflineEvent/create' },
      ]
    },
    { 
      key: 'industryReport', 
      label: '行研报告', 
      path: '/demands/IndustryReport', 
      matchPaths: ['/demands/IndustryReport'] 
    },
    { 
      key: 'industryTalent', 
      label: '专家人才', 
      path: '/demands/Talent', 
      matchPaths: ['/demands/Talent'] 
    },
    // { 
    //   key: 'techForum', 
    //   label: '技术论坛', 
    //   fn: (router, message) => { 
    //     message.info('业务即将上线，敬请期待');
    //   } 
    // },
   
    { 
      key: 'industryDynamics', 
      label: '行业热点', 
      path: '/industry-dynamics', 
      matchPaths: ['/industry-dynamics'] 
    },
  ]);

  /**
   * 检查给定的导航项是否应处于“激活”状态。
   * @param {NavItem} navItem - 要检查的导航项。
   * @returns {boolean}
   */
  const isActiveNavItem = (navItem) => {
    // 如果没有路径定义或是一个功能性按钮，则不激活
    if (!navItem.matchPaths || navItem.fn) {
      return false;
    }

    // 根据 navItem.exact 确定匹配函数（精确匹配或前缀匹配）
    const matchFn = navItem.exact 
      ? (p) => route.path === p
      : (p) => route.path.startsWith(p);
    
    // 检查路径是否匹配
    const pathIsActive = navItem.matchPaths.some(matchFn);

    // 如果路径不匹配，立即返回 false
    if (!pathIsActive) {
      return false;
    }

    // 确定是否需要进行查询参数的校验
    // 条件：navItem 定义了 queryParams 且当前路由的路径正好是那个需要用 query 区分的主路径
    const needsQueryCheck = navItem.queryParams && route.path === navItem.path;

    // 如果不需要检查 query，则直接返回 true (因为路径已匹配)
    // 如果需要检查，则执行检查，并返回检查结果
    return !needsQueryCheck || Object.entries(navItem.queryParams).every(
      ([key, value]) => route.query[key] === value
    );
  };
  const handlePurchaseClick = (partnerKey) => {
    const authStore = useAuthStore();
    if (authStore.isLogin) {
      let url = ''
      const urlMap = {
        'aian': '/apm/jicai/redirectToAtEdiJson',
        'jd': '/apm/jicai/redirectToJdJson',
        'guoptics': '/apm/jicai/redirectToLianHeGuangKeiJson'
      }
      url = urlMap[partnerKey]
      defHttp.get({ url }).then((res) => {
        if(res.success){
          window.open(res.result, '_blank');
        } else {
          message.error(res.message);
        }
      });
    } else {
      const modalStore = useModalStore(); 
      modalStore.showLogin();
    }
  }

  const handleDevelopingFeature = () => {
    message.info('功能正在开发中，敬请期待');
  }

  return {
    navigationItems,
    isActiveNavItem,
  };
}