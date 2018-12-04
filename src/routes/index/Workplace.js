import React, {Fragment, PureComponent} from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import DataSet from '@antv/data-set';
import {
  Row,
  Col,
  Card,
  List,
  Avatar,
  Tabs,
  Icon,
  Calendar,
  Badge,
  Button,
  Divider,
  DatePicker,
  Select,
  message,
} from 'antd';
import { Chart, Axis, Geom, Tooltip, Coord, Label, Legend, Guide } from 'bizcharts';
import { Bar } from '../../components/Charts';
import MessageModal from './MessageModal';
import CusApplyApprovalModal from './CusApplyApprovalModal';
import NewProAssignAddModal from './ProAssignAddModal';
import ProAssignAddModal from '../projectAssign/ProAssignAddModal';
import ProjectAddModal from '../Project/ProInfoManage/ProAddModal';
import ScheduleAddModal from '../schedule/ScheduleAddModal';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getTimeDistance } from '../../utils/utils';
import styles from './Workplace.less';
import TemAuthorizationModal from '../projectTemAuth/TemAuthorization';
import ProjectAssignmentModal from '../projectassignment/AssignmentAddModal';
import StandardTable from "../../components/MessageTable";


const { Option } = Select;
const { RangePicker } = DatePicker;
const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `审计部 ${i} 杭州`,
    total: 323234,
  });
}
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const status = ['未读', '已读'];
const msgPriority = ['低','中','高'];
const MsgType = ['通知','任务','更新消息','事物消息','即时消息','办公消息'];
const msgBizType = ['工作流消息','预警','即时消息','催办','办公'];
const { TabPane } = Tabs;
const { Html } = Guide;
const dataPie = [
  { item: '杭州', count: 40 },
  { item: '义乌', count: 21 },
  { item: '浦江', count: 17 },
  { item: '金华', count: 13 },
  { item: '东阳', count: 9 },
];
const ds = new DataSet();
const dv = ds.createView();
dv.source(dataPie).transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent',
});
const colsPie = {
  percent: {
    formatter: val => {
      val = val * 100 + '%';
      return val;
    },
  },
};

let toLink = 'schedule/notice';

function callback(key) {
  console.log(key);
  if (key === 'notice') {
    toLink = 'schedule/notice';
  }
}

@connect(({ project, projectAssignment, activities, chart,sysMessage,loading }) => ({
  project,
  activities,
  chart,
  sysMessage,
  projectAssignment,
  projectLoading: loading.effects['project/fetchNotice'],
  activitiesLoading: loading.effects['activities/fetchList'],
  projectMessage: loading.effects['sysMessage/fetchList'],
}))
export default class Workplace extends PureComponent {
   //constructor(props){
     //super(props);
     state = {
       projectTemAuthVisible: false,
       projectAssigVisible: false,
       ScheduleAddVisible: false,
       proAddVisible: false,
       proAssignAddVisible: false,
       messageInfoVisible: false,
       rangePickerValue: getTimeDistance('year'),
       currentUser: JSON.parse(localStorage.getItem("user")),
       timeValue:"",
       pageCurrent: ``,
       pageSizeCurrent: ``,
       rowInfo: {},
       rowTextColor: false,  //  false 表示未读  true 已读
       newProAssignAddVisible: false, // 需要配合打开新的指派单modal
       proAssignInfo: null,
       cusApplyApprovalVisible: false, // 客户审批界面
       cusApplyInfo: null,
     };
   //}

  componentDidMount() {
    const { dispatch } = this.props;
    const user = JSON.parse(localStorage.getItem("user"));
   /* if(!user.name){
      dispatch(routerRedux.push("/user/login"));
      return;
    }*/
    dispatch({
      type: 'project/fetchNotice',
    });
    dispatch({
      type: 'activities/fetchList',
    });
    dispatch({
      type: 'sysMessage/fetchList',
      payload:{
        page:1,
        pageSize:10,
      },
    });

    this.getTimeValue();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  handleLink = () => {
    this.props.dispatch(routerRedux.push(toLink));
    window.scrollTo(0, 0);
  };

  handleClick = () => {
    console.log(11111111111111);
  };

  handleArea = () => {
    window.scrollTo(0, 0);
  };

  // 项目临时授权
  handleProjectTemAuthAddVisible = flag => {
    this.setState({
      projectTemAuthVisible: !!flag,
    });
  };

  // 项目指派
  handleProjectAssignmentAddVisible = flag => {
    this.setState({
      projectAssigVisible: !!flag,
    });
  };

  // 新增日程
  handleScheduleAddVisible = flag => {
    this.setState({
      ScheduleAddVisible: !!flag,
    });
  };

  // 项目新增显示隐藏方法
  handleProAddVisible = flag => {
    this.setState({
      proAddVisible: !!flag,
    });
  };

  handleProAssignAddVisible = flag => {
    this.setState({
      proAssignAddVisible: !!flag,
    });
  };

  handleCusApplyApprovalVisible = (flag, sourceId) => {
    if (sourceId != null) {
      this.props.dispatch({
        type: 'cusApplication/getInfoById',
        payload:{
          id: sourceId,
        },
        callback: res => {
          if (res.meta.status !== '000000') {
            message.error(res.meta.alertMsg);
          } else {
            console.log(res.data.list);
            this.setState({
              cusApplyInfo: res.data.list,
              cusApplyApprovalVisible: !!flag,
            });
          }
        },
      });
    } else {
      this.setState({
        cusApplyApprovalVisible: !!flag,
      });
    }
  };

  // 控制项目信息弹窗
  handleMessageInfoVisible = (flag) => {
    this.setState({
      messageInfoVisible: !!flag,
    });
  };

  // 需要配合打开新的指派单modal
  handleNewProAssignVisible = (flag, sourceId) => {
    if (sourceId != null) {
      this.props.dispatch({
        type: 'projectAssignment/getInfoById',
        payload:{
          id: sourceId,
        },
        callback: res => {
          if (res.meta.status !== '000000') {
            message.error(res.meta.alertMsg);
          } else {
            console.log(res.data.list);
            this.setState({
              proAssignInfo: res.data.list,
              newProAssignAddVisible: !!flag,
            });
          }
        },
      });
    } else {
        this.setState({
          newProAssignAddVisible: !!flag,
        });
    }

  };

  // 根据当前行的id, 查询对应的项目信息
  GetMsgVisible = (flag, record) => {
    this.props.dispatch({
      type: 'sysMessage/update', // 接口修改项目接口
      payload:{
        id: record.id, // 点击行的项目id
        status: 1,
      },
      callback: () => {
        this.props.dispatch({
          type: 'sysMessage/fetchList',
          payload:{
            page:1,
            pageSize:10,
          },
        });
      },

    });
    if(record.bizType){
        if(record.bizType === 110){  // 新建项目

          this.handleProAddVisible(true);

        }else if(record.bizType === 80){ // 审批项目

        }else if(record.bizType === 90){ // 审批客户
          this.handleCusApplyApprovalVisible(true, record.sourceId);
        }else if(record.bizType === 100){ // 需要配合指派 打开新的指派单（项目名称，部门经理，项目经理，配合项目经理（带入上一次的指派单上的项目经理），说明，）
          this.handleNewProAssignVisible(true, record.sourceId);
        }
    }else {
       // 提示消息
    }



    /*this.props.dispatch({
      type: 'cusApplication/fetch', // 接口修改项目接口
      payload:{
        id: '0489342eee0811e88aa5186024a65a7c',  // 点击行的项目id
      },
      callback: (res) => {
        if(res.meta.status !== '000000' ) {
          message.error(res.meta.errmsg);
        } else {
          this.setState({
            rowInfo: res.data.list[0],
            messageInfoVisible: !!flag,
          });
        }
      },
    });*/
  };

  handleRangePickerChange = rangePickerValue => {
    this.setState({
      rangePickerValue,
    });

    /* this.props.dispatch({
      type: 'chart/fetchSalesData',
    });*/
  };

  selectDate = type => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    /* this.props.dispatch({
      type: 'chart/fetchSalesData',
    });*/
  };

  handleViewInfo = () => {
    console.log("双击了");
  };

  pushCenterMsg = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/fetchNotice',
    });
    dispatch({
      type: 'activities/fetchList',
    });
    dispatch({
      type: 'sysMessage/fetchList',
      payload:{
        page:1,
        pageSize:10,
      },
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }

  getTimeValue(){
    const now = new Date();
    const hour = now.getHours();
    if(hour < 6){
      this.setState({timeValue:"凌晨好,"+ this.state.currentUser.name +",最敬业的就是你！"});
    }
    else if (hour < 9){
      this.setState({timeValue:"早上好,"+ this.state.currentUser.name +",又是元气满满的一天！"});
    }
    else if (hour < 12){
      this.setState({timeValue:"上午好,"+ this.state.currentUser.name +",记得喝些咖啡！"});
    }
    else if (hour < 14){
      this.setState({timeValue:"中午好,"+ this.state.currentUser.name +",要休息一下下！"});
    }
    else if (hour < 17){
      this.setState({timeValue:"下午好,"+ this.state.currentUser.name +",记得喝些咖啡！"});
    }
    else if (hour < 19){
      this.setState({timeValue:"傍晚好,"+ this.state.currentUser.name +",开心的一天结束了！"});
    }
    else if (hour < 22){
      this.setState({timeValue:"晚上好,"+ this.state.currentUser.name +",要早些休息！"});
    }
    else {
      this.setState({timeValue:"夜里好,"+ this.state.currentUser.name +",要早些休息！"});
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, pageCurrent, pageSizeCurrent } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    this.setState({
      pageCurrent: params.page,
      pageSizeCurrent: params.pageSize,
    });

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'user/fetch', // 翻页时，上一页下一页刷新列表
      payload: params,
    });
  };

  renderActivities() {
    const { activities: { list } } = this.props;
    return list.map(item => {
      const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
        if (item[key]) {
          return (
            <a href={item[key].link} key={item[key].name}>
              {item[key].name}
            </a>
          );
        }
        return key;
      });
      return (
        <List.Item key={item.id}>
          <List.Item.Meta
            avatar={<Avatar src={item.userInfo.avatar} />}
            title={
              <span>
                <a className={styles.username}>{item.userInfo.name}</a>
                &nbsp;
                <span className={styles.event}>{events}</span>
              </span>
            }
            description={
              <span className={styles.datetime} title={item.updatedAt}>
                {moment(item.updatedAt).fromNow()}
              </span>
            }
          />
        </List.Item>
      );
    });
  }





  render() {
    const { sysMessage : { messageData },activitiesLoading,projectMessage, chart, loading } = this.props;
    const {
      ScheduleAddVisible,
      projectTemAuthVisible,
      projectAssigVisible,
      rangePickerValue,
      timeValue,
      proAddVisible,
      proAssignAddVisible,
      messageInfoVisible,
      newProAssignAddVisible,
      rowInfo,
      proAssignInfo,
      cusApplyApprovalVisible,
      cusApplyInfo,
    } = this.state;

    const columns = [
      {
        title: '优先级',
        dataIndex: 'priority',
        className:'',
        filters: [
          {
            text: msgPriority[0],
            value: 0,
          },
          {
            text: msgPriority[1],
            value: 10,
          },
          {
            text: msgPriority[2],
            value: 20,
          },
        ],
        width: 100,
        onFilter: (value, record) => record.priority.toString() === value,
        render(val) {
          if(val === 20){
            return <Badge status={msgPriority[2]} text={msgPriority[2]} />;
          }
          if(val === 10){
            return <Badge status={msgPriority[1]} text={msgPriority[1]} />;
          }
          if(val === 0){
            return <Badge status={msgPriority[0]} text={msgPriority[0]} />;
          }

        },
      },
      {
        title: '主题',
        dataIndex: 'title',
      },
      {
        title: '内容',
        dataIndex: 'body',
      },
      {
        title: '发送时间',
        dataIndex: 'sendTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '发送人',
        dataIndex: 'sender',
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 150,
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={status[val]} text={status[val]} />;
        },
      },
    ];

    const moreCharts = (
      <a onClick={() => this.handleLink()}>
        <span style={{ paddingRight: 15 }}>更多图表</span>
      </a>
    );
    const moreMessage = (
      <a onClick={() => this.handleLink()}>
        <span style={{ paddingRight: 15 }}>更多</span>{' '}
      </a>
    );

    const { salesData } = chart;
    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            今日
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            本周
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            本月
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            全年
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="large"
            src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>{timeValue}</div>
          <div>技术专家 | 至诚软件－研发中心－CTO</div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>项目数</p>
          <p>56</p>
        </div>
        <div className={styles.statItem}>
          <p>进行中</p>
          <p>50</p>
        </div>
        <div className={styles.statItem}>
          <p>已完成</p>
          <p>6</p>
        </div>
        <div className={styles.statItem}>
          <p>合同金额</p>
          <p>2,000</p>
        </div>
        <div className={styles.statItem}>
          <p>应收款金额</p>
          <p>2,223</p>
        </div>
      </div>
    );

    const { contractData } = chart;

    const cols = {
      sales: { tickInterval: 20 },
    };
    const data = [
      { department: '审计一部', sales: 38 },
      { department: '审计二部', sales: 52 },
      { department: '审计三部', sales: 61 },
      { department: '财务部', sales: 145 },
      { department: '行政部', sales: 48 },
      { department: '开发部', sales: 38 },
      { department: '教研部', sales: 38 },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['5', '10', '15', '20'],
      total: 50,
    };

    // 项目临时授权
    const parentMethods = {
      handleProAssignAddVisible: this.handleProAssignAddVisible,
      handleNewProAssignVisible: this.handleNewProAssignVisible,
      handleProAddVisible: this.handleProAddVisible,
      handleProjectTemAuthAddVisible: this.handleProjectTemAuthAddVisible,
      handleProjectAssignmentAddVisible: this.handleProjectAssignmentAddVisible,
      handleScheduleAddVisible: this.handleScheduleAddVisible,
      handleMessageInfoVisible: this.handleMessageInfoVisible,
      handleCusApplyApprovalVisible: this.handleCusApplyApprovalVisible,
    };

    return (
      <PageHeaderLayout
        className={styles.cardstyle}
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <div className={styles.header}>
          <div className={styles['fn-right']}>
            <Icon type="edit" theme="outlined" />
          </div>
          <h3 className={styles.headerh3}>近期事物</h3>
        </div>
        <Card className={styles.cardstyle}>
          <Row gutter={8}>
            <Col span={2}>
              <Badge count={0}>
                <div className={styles['gutter-box1']}>
                  <h4>项目审批</h4>
                  <p>0个待审批的项目</p>
                </div>
              </Badge>
            </Col>
            <Col span={2}>
              <Badge count={3}>
                <div className={styles['gutter-box2']}>
                  <h4>合同审批</h4>
                  <p>3个待审批的合同</p>
                </div>
              </Badge>
            </Col>
            <Col span={2}>
              <Badge count={1}>
                <div className={styles['gutter-box3']}>
                  <h4>费用审批</h4>
                  <p>1个待审批的费用</p>
                </div>
              </Badge>
            </Col>
            <Col span={2}>
              <Badge count={10}>
                <div className={styles['gutter-box4']}>
                  <h4>请假审批</h4>
                  <p>10个待审批的请假</p>
                </div>
              </Badge>
            </Col>
            <Col span={2}>
              <Badge count={6}>
                <div className={styles['gutter-box5']}>
                  <h4>报销审批</h4>
                  <p>6个待审批的报销</p>
                </div>
              </Badge>
            </Col>
            <Col span={2}>
              <Badge count={6}>
                <div className={styles['gutter-box5']}>
                  <h4>项目指派</h4>
                  <p>指派10个，待处理6个,完成4个</p>
                </div>
              </Badge>
            </Col>
          </Row>
        </Card>
        <div className={styles.header}>
          <div className={styles['fn-right']}>
            <Icon type="edit" theme="outlined" />
          </div>
          <h3 className={styles.headerh3}>消息中心</h3>
        </div>
        <Row gutter={24} className={styles['row-h']}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24, height: 'auto', borderRadius: 6 }}
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <Tabs
                defaultActiveKey="notice"
                onChange={this.pushCenterMsg}
                tabBarExtraContent={moreMessage}
              >
                <TabPane
                  tab={
                    <span>
                      <Icon type="notification" />公告通知
                    </span>
                  }
                  key="notice"
                >
                  <List loading={activitiesLoading} size="large">
                    <div className={styles.activitiesList}>{this.renderActivities()}</div>
                  </List>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <Icon type="bell" />待办消息
                    </span>
                  }
                  key="bellMes"
                >
                  <List loading={activitiesLoading} size="large">
                    <div className={styles.activitiesList}>{this.renderActivities()}</div>
                  </List>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <Icon type="bell" />预警消息
                    </span>
                  }
                  key="Earlywarning"
                >
                  <List loading={activitiesLoading} size="large">
                    <div className={styles.activitiesList}>{this.renderActivities()}</div>
                  </List>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <Icon type="bell" />项目消息
                    </span>
                  }
                  key="projctMes"
                  onTabClick={() => this.handleMessageInfoVisible(true)}
                >
                  <StandardTable
                    loading={projectMessage}
                    data={messageData}
                    columns={columns}
                    onChange={this.handleStandardTableChange}
                    rowClassName={(record, index) => record.status === 0 ?styles.csbsTypes:''} // 根据是否已读状态改变行字体属性
                    onRow={(record) => {  // 表格行点击事件
                      return {
                        onDoubleClick: () => {
                          this.GetMsgVisible(true, record)
                        },
                      };
                    }}
                  />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
        <div className={styles.header}>
          <div className={styles['fn-right']}>
            <Icon type="edit" theme="outlined" />
          </div>
          <h3 className={styles.headerh3}>快捷常用工具</h3>
        </div>
        <Card className={styles.cardstyle}>
          <Row gutter={20}>
            <Col xl={4} md={6} sm={8} xs={12}>
              <Link
                className={styles['shortcut-box1']}
                to="/crm/customer"
                onClick={this.handleArea}
              >
                <div>
                  <Icon className={styles.iconhz} type="star" />
                </div>
                <h5>客户信息管理</h5>
              </Link>
            </Col>
            <Col xl={4} md={6} sm={8} xs={12}>
              <Link
                className={styles['shortcut-box1']}
                to="/crm/customer"
                onClick={this.handleArea}
              >
                <div>
                  <Icon className={styles.iconhz} type="star" />
                </div>
                <h5>客户信息管理</h5>
              </Link>
            </Col>
            <Col xl={4} md={6} sm={8} xs={12}>
              <Link
                className={styles['shortcut-box1']}
                to="/crm/customer"
                onClick={this.handleArea}
              >
                <div>
                  <Icon className={styles.iconhz} type="star" />
                </div>
                <h5>客户信息管理</h5>
              </Link>
            </Col>
            <Col xl={4} md={6} sm={8} xs={12}>
              <Link
                className={styles['shortcut-box2']}
                to="/project/projectinfo"
                onClick={this.handleArea}
              >
                <div>
                  <Icon className={styles.iconhz} type="star" />
                </div>
                <h5>项目信息管理</h5>
              </Link>
            </Col>
            <Col xl={4} md={6} sm={8} xs={12}>
              <Link
                className={styles['shortcut-box3']}
                to="/schedule/schedulelist"
                onClick={this.handleArea}
              >
                <div>
                  <Icon className={styles.iconhz} type="star" />
                </div>
                <h5>日常管理</h5>
              </Link>
            </Col>
            <Col xl={4} md={6} sm={8} xs={12}>
              <Link className={styles['shortcut-box4']} to="/HR/organize" onClick={this.handleArea}>
                <div>
                  <Icon className={styles.iconhz} type="star" />
                </div>
                <h5>组织结构</h5>
              </Link>
            </Col>
            <Col xl={4} md={6} sm={8} xs={12}>
              <Link
                className={styles['shortcut-box5']}
                to="/ExpenseReimbursement/ExpenseApply"
                onClick={this.handleArea}
              >
                <div>
                  <Icon className={styles.iconhz} type="star" />
                </div>
                <h5>费用申请单</h5>
              </Link>
            </Col>
            <Col xl={4} md={6} sm={8} xs={12}>
              <a
                className={styles['shortcut-box5']}
                type="primary"
                onClick={() => this.handleProjectAssignmentAddVisible(true)}
              >
                <div>
                  <Icon className={styles.iconhz} type="star" />
                </div>
                <h5>项目指派</h5>
              </a>
            </Col>
            <Col xl={4} md={6} sm={8} xs={12}>
              <a
                className={styles['shortcut-box3']}
                type="primary"
                onClick={() => this.handleProjectTemAuthAddVisible(true)}
              >
                <div>
                  <Icon className={styles.iconhz} type="star" />
                </div>
                <h5>项目临时授权</h5>
              </a>
            </Col>
            <Col xl={4} md={6} sm={8} xs={12}>
              <a
                className={styles['shortcut-box3']}
                type="primary"
                onClick={() => this.handleProAddVisible(true)}
              >
                <div>
                  <Icon className={styles.iconhz} type="star" />
                </div>
                <h5>非项目指派</h5>
              </a>
            </Col>
            <Col xl={4} md={6} sm={8} xs={12}>
              <a
                className={styles['shortcut-box3']}
                type="primary"
                onClick={() => this.handleProAssignAddVisible(true)}
              >
                <div>
                  <Icon className={styles.iconhz} type="star" />
                </div>
                <h5>跨项目指派</h5>
              </a>
            </Col>
          </Row>
        </Card>

        <div className={styles.header}>
          <div className={styles['fn-right']}>
            <Icon type="edit" theme="outlined" />
          </div>
          <h3 className={styles.headerh3}>日程管理</h3>
        </div>
        <Row gutter={24} className={styles['row-h']}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24} style={{ borderRadius: 6 }}>
            <Card bodyStyle={{ padding: 0 }} className={styles.cardstyle} bordered={false}>
              <div className="calendar-all" id="homeCalendarCon">
                <div className={styles['ant-fullcalendar-header-buttonhz']}>
                  <a type="primary" onClick={() => this.handleScheduleAddVisible(true)}>
                    新增日程
                  </a>
                  <Divider type="vertical" />
                  <Link to="/schedule/schedulelist" onClick={this.handleArea}>
                    日常管理
                  </Link>
                </div>
                <Calendar fullscreen={false} />
              </div>
            </Card>
          </Col>
        </Row>
        <div className={styles.header}>
          <div className={styles['fn-right']}>
            <Icon type="edit" theme="outlined" />
          </div>
          <h3 className={styles.headerh3}>图表管理</h3>
        </div>
        <Row gutter={24} className={styles['row-h']}>
          <Col>
            <Card
              loading={loading}
              bordered={false}
              bodyStyle={{ padding: 0 }}
              style={{ borderRadius: 6 }}
            >
              <div className={styles.salesCard}>
                <Tabs
                  tabBarExtraContent={salesExtra}
                  size="large"
                  tabBarStyle={{ marginBottom: 24 }}
                >
                  <TabPane tab="销售额" key="sales">
                    <Row>
                      <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                        <div className={styles.salesBar}>
                          <div>
                            <Select defaultValue={0} style={{ width: 130 }}>
                              <Option value={0}>杭州至诚</Option>
                              <Option value={1}>义务至诚</Option>
                            </Select>
                          </div>
                          <div className={styles.salesBar}>
                            <Chart
                              height={400}
                              data={data}
                              scale={cols}
                              title="销售额趋势"
                              forceFit
                            >
                              <Axis name="department" />
                              <Axis name="sales" />
                              <Tooltip showTitle={false} crosshairs={{ type: 'cross' }} />
                              <Geom
                                type="interval"
                                position="department*sales"
                                tooltip={[
                                  'department*sales',
                                  (department, sales) => {
                                    return {
                                      name: department,
                                      value:
                                        '<br><span style="padding-left: 16px">项目总数：' +
                                        sales +
                                        '</span><br/>' +
                                        '<span style="padding-left: 16px">在建：1</span><br/>' +
                                        '<span style="padding-left: 16px">启动中：2</span><br/>' +
                                        '<span style="padding-left: 16px">已归档：3</span>',
                                    };
                                  },
                                ]}
                              />
                            </Chart>
                          </div>
                        </div>
                      </Col>
                      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                        <div className={styles.salesRank}>
                          <h4 className={styles.rankingTitle}>部门销售额排名</h4>
                          <ul className={styles.rankingList}>
                            {rankingListData.map((item, i) => (
                              <li key={item.title}>
                                <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                                <span>{item.title}</span>
                                <span>{numeral(item.total).format('0,0')}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="访问量" key="views">
                    <Row>
                      <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                        <div className={styles.salesBar}>
                          <div className={styles.salesBar}>
                            <Chart
                              height={400}
                              data={data}
                              scale={cols}
                              title="访问量趋势"
                              forceFit
                            >
                              <Axis name="department" />
                              <Axis name="sales" />
                              <Tooltip showTitle={false} crosshairs={{ type: 'cross' }} />
                              <Geom
                                type="interval"
                                position="department*sales"
                                tooltip={[
                                  'department*sales',
                                  (department, sales) => {
                                    return {
                                      name: department,
                                      value:
                                        '<br><span style="padding-left: 16px">项目总数：' +
                                        sales +
                                        '</span><br/>' +
                                        '<span style="padding-left: 16px">在建：1</span><br/>' +
                                        '<span style="padding-left: 16px">启动中：2</span><br/>' +
                                        '<span style="padding-left: 16px">已归档：3</span>',
                                    };
                                  },
                                ]}
                              />
                            </Chart>
                          </div>
                        </div>
                      </Col>
                      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                        <div className={styles.salesRank}>
                          <h4 className={styles.rankingTitle}>门店访问量排名</h4>
                          <ul className={styles.rankingList}>
                            {rankingListData.map((item, i) => (
                              <li key={item.title}>
                                <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                                <span>{item.title}</span>
                                <span>{numeral(item.total).format('0,0')}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <Icon type="pie-chart" />客户贡献度
                      </span>
                    }
                    key="1"
                  >
                    <Row>
                      <Col xl={8} lg={12} md={12} sm={12} xs={12}>
                        <Chart
                          width={400}
                          height={400}
                          data={dv}
                          scale={colsPie}
                          padding={[80, 100, 80, 80]}
                          onPlotClick={() => this.handleClick()}
                          forceFit
                        >
                          <Coord type="theta" radius={0.75} innerRadius={0.6} />
                          <Axis name="percent" />
                          <Legend
                            position="right"
                            offsetY={-window.innerHeight / 3 + 200}
                            offsetX={-140}
                          />
                          <Tooltip
                            showTitle={false}
                            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                          />
                          <Guide>
                            <Html
                              position={['50%', '50%']}
                              html="<div style=&quot;color:#8c8c8c;font-size:0.84em;text-align: center;width: 10em;&quot;>客户<br><span style=&quot;color:#262626;font-size:2.5em&quot;>100</span>万</div>"
                              alignX="middle"
                              alignY="middle"
                            />
                          </Guide>
                          <Geom
                            type="intervalStack"
                            position="percent"
                            color="item"
                            tooltip={[
                              'item*percent',
                              (item, percent) => {
                                percent = percent * 100 + '%';
                                return {
                                  name: item,
                                  value: percent,
                                };
                              },
                            ]}
                            style={{ lineWidth: 1, stroke: '#fff' }}
                          >
                            <Label
                              content="percent"
                              offset={-20}
                              textStyle={{
                                rotate: 0,
                                textAlign: 'center',
                                shadowBlur: 2,
                                shadowColor: 'rgba(0, 0, 0, .45)',
                              }}
                            />
                          </Geom>
                        </Chart>
                      </Col>
                      <Col xl={8} lg={12} md={12} sm={12} xs={12}>
                        <Chart
                          width={400}
                          height={400}
                          data={dv}
                          scale={colsPie}
                          padding={[80, 100, 80, 80]}
                          onPlotClick={() => this.handleClick()}
                          forceFit
                        >
                          <Coord type="theta" radius={0.75} innerRadius={0.6} />
                          <Axis name="percent" />
                          <Legend
                            position="right"
                            offsetY={-window.innerHeight / 3 + 200}
                            offsetX={-85}
                          />
                          <Tooltip
                            showTitle={false}
                            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                          />
                          <Guide>
                            <Html
                              position={['50%', '50%']}
                              html="<div style=&quot;color:#8c8c8c;font-size:0.84em;text-align: center;width: 10em;&quot;>客户<br><span style=&quot;color:#262626;font-size:2.5em&quot;>100</span>万</div>"
                              alignX="middle"
                              alignY="middle"
                            />
                          </Guide>
                          <Geom
                            type="intervalStack"
                            position="percent"
                            color="item"
                            tooltip={[
                              'item*percent',
                              (item, percent) => {
                                percent = percent * 100 + '%';
                                return {
                                  name: item,
                                  value: percent,
                                };
                              },
                            ]}
                            style={{ lineWidth: 1, stroke: '#fff' }}
                          >
                            <Label
                              content="percent"
                              offset={-20}
                              textStyle={{
                                rotate: 0,
                                textAlign: 'center',
                                shadowBlur: 2,
                                shadowColor: 'rgba(0, 0, 0, .45)',
                              }}
                            />
                          </Geom>
                        </Chart>
                      </Col>
                      {/*    <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                      <Chart
                        width={500}
                        height={500}
                        data={dv}
                        scale={cols}
                        padding={[ 80, 100, 80, 80 ]}
                        forceFit
                      >
                        <Coord type='theta' radius={0.75} innerRadius={0.6} />
                        <Axis name="percent" />
                        <Legend position='bottom' />
                        <Tooltip
                          showTitle={false}
                          itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                        />
                        <Guide >
                          <Html position={[ '50%', '50%' ]} html='<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;">客户<br><span style="color:#262626;font-size:2.5em">100</span>万</div>' alignX='middle' alignY='middle' />
                        </Guide>
                        <Geom
                          type="intervalStack"
                          position="percent"
                          color='item'
                          tooltip={['item*percent',(item, percent) => {
                            percent = percent * 100 + '%';
                            return {
                              name: item,
                              value: percent,
                            };
                          }]}
                          style={{lineWidth: 1,stroke: '#fff'}}
                        >
                          <Label
                            content='percent'
                            formatter={(val, item) => {
                              return item.point.item + ': ' + val;}}
                          />
                        </Geom>
                      </Chart>
                    </Col>*/}
                    </Row>
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <Icon type="bar-chart" />项目量
                      </span>
                    }
                    key="2"
                  >
                    <Row>
                      <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                        <div className={styles.salesBar}>
                          <Chart height={400} data={data} scale={cols} title="项目量趋势" forceFit>
                            <Axis name="department" />
                            <Axis name="sales" />
                            <Tooltip showTitle={false} crosshairs={{ type: 'cross' }} />
                            <Geom
                              type="interval"
                              position="department*sales"
                              tooltip={[
                                'department*sales',
                                (department, sales) => {
                                  return {
                                    name: department,
                                    value:
                                      '<br><span style="padding-left: 16px">项目总数：' +
                                      sales +
                                      '</span><br/>' +
                                      '<span style="padding-left: 16px">在建：1</span><br/>' +
                                      '<span style="padding-left: 16px">启动中：2</span><br/>' +
                                      '<span style="padding-left: 16px">已归档：3</span>',
                                  };
                                },
                              ]}
                            />
                          </Chart>
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <Icon type="bar-chart" />合同量
                      </span>
                    }
                    key="3"
                  >
                    <Row>
                      <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                        <div className={styles.salesBar}>
                          {/*<Bar height={500} title="合同额趋势" data={contractData} />*/}
                          <div className={styles.salesBar}>
                            <Chart
                              height={400}
                              data={data}
                              scale={cols}
                              title="合同额趋势"
                              forceFit
                            >
                              <Axis name="department" />
                              <Axis name="sales" />
                              <Tooltip showTitle={false} crosshairs={{ type: 'cross' }} />
                              <Geom
                                type="interval"
                                position="department*sales"
                                tooltip={[
                                  'department*sales',
                                  (department, sales) => {
                                    return {
                                      name: department,
                                      value:
                                        '<br><span style="padding-left: 16px">项目总数：' +
                                        sales +
                                        '</span><br/>' +
                                        '<span style="padding-left: 16px">在建：1</span><br/>' +
                                        '<span style="padding-left: 16px">启动中：2</span><br/>' +
                                        '<span style="padding-left: 16px">已归档：3</span>',
                                    };
                                  },
                                ]}
                              />
                            </Chart>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                </Tabs>
              </div>
            </Card>
          </Col>
        </Row>
        <ScheduleAddModal {...parentMethods} ScheduleAddVisible={ScheduleAddVisible} />
        <TemAuthorizationModal
          {...parentMethods}
          projectTemAuthVisible={projectTemAuthVisible}
        />
        <ProjectAssignmentModal
          {...parentMethods}
          projectAssigVisible={projectAssigVisible}
        />
        <ProAssignAddModal {...parentMethods} proAssignAddVisible={proAssignAddVisible} />
        <ProjectAddModal {...parentMethods} proAddVisible={proAddVisible} />
        <NewProAssignAddModal {...parentMethods} newProAssignAddVisible={newProAssignAddVisible} proAssignInfo={proAssignInfo} />
        <MessageModal {...parentMethods} messageInfoVisible={messageInfoVisible} rowInfo={rowInfo} />
        <CusApplyApprovalModal {...parentMethods} cusApplyApprovalVisible={cusApplyApprovalVisible} cusApplyInfo={cusApplyInfo} />
      </PageHeaderLayout>
    );
  }
}
