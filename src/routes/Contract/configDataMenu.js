export default {
    menus: [ // 菜单相关路由
        { key: '/app/dashboard/index', title: '首页', icon: 'mobile' },
        { key: '/app/index', title: '绩效目标评审', icon: 'home' },
        { key: '/app/note', title: '评审须知', icon: 'bell' },
        {
            key: '/app/evaluation/', title: '评价指标库', icon: 'database',
            childs: [
                { key: '/app/evaluation/project/indicator', title: '项目指标表' },
                { key: '/app/evaluation/after/view', title: '评审后的绩效指标库查询' },
            ],
        },
        {
            key: '/app/report', title: '相关报表', icon: 'bar-chart',
          childs: [
                { key: '/app/report/workSumReport', title: '绩效目标评审工作汇总表' },
            ],
        },
        {
            key: '/app/PolicyLibrary', title: '政策库', icon: 'audit',
          childs: [
                { key: '/app/PolicyLibrary/one', title: '国家政策' },
                { key: '/app/PolicyLibrary/two', title: '省政策' },
                { key: '/app/PolicyLibrary/three', title: '杭州市政策'},
                { key: '/app/PolicyLibrary/four', title: '其他政策' },
            ],
        },
        {
            key: '/app/knowledge', title: '知识库', icon: 'profile',
          childs: [
                { key: '/app/knowledge/indicator', title: '经典绩效指标库' },
                { key: '/app/knowledge/excellent', title: '优秀案例库' },
            ],
        },
    ],
    others: [], // 非菜单相关路由
}
