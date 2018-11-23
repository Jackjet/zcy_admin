import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  // TimePicker,
  Input,
  Select,
  Popover,
  Checkbox,
  Modal,
  Divider,
  Upload,
  Collapse,
  Table,
  Popconfirm,
  Layout,
  Steps,
  Menu,
  message,
  Spin,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment/moment';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import Step4 from './Steps/Step4';
import Step6 from './Steps/Step6';
import Step7 from './Steps/Step7';
import Step8 from './Steps/Step8';
import Step9 from './Steps/Step9';
import Step10 from './Steps/Step10';
import Step11 from './Steps/Step11';
import Step12 from './Steps/Step12';
import Step13 from './Steps/Step13';

import ChoiceCusModal from '../add/ChoiceCusModal';
import ConstructUnitModal from '../add/ConstructUnitModal';
import EditableCell from '../../../components/EditableTable/index';
import styles from '../add/style.less';


const { Step } = Steps;
const { Content, Sider } = Layout;
const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const BillSourceOption = ['招标', '合伙人', '其他'];
const CheckBoxOption = ['底稿', '报告', '工程', '项目', '合同'];

const fieldLabels = {
  number: '项目编码',
  type: '项目类别',
  years: '年度',
  name: '项目名称',
  dateRange: '生效日期',
  cuslink: '客户联系人',
  customer: '客户',
  url: '网站主页',
  taxcode: '税务登记号',
  fzcompany: '负责公司',
  fzperson: '项目负责人',
  fee: '项目费用',
  startDate: '开始日期',
  endDate: '结束日期',
  biztype: '业务类别',
  content: '项目内容',
  address: '详细地址',
  remark: '备注',
  status: '状态',
  jfw: '交付物',
  demand: '客户需求',
  attachment: '附件',
};

const fileList = [
  {
    uid: -1,
    name: 'xxx.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: -2,
    name: 'yyy.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
];

const props2 = {
  action: '//jsonplaceholder.typicode.com/posts/',
  listType: 'picture',
  defaultFileList: [...fileList],
  className: styles['upload-list-inline'],
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class ProjectAddModal extends PureComponent {
  state = {
    width: '100%',
    projectOptionData: [],
    BillSourceOptionData: ``,
    BillSourceValue: ``,
    CusOptionData: ``,
    dataSource: [
      {
        key: '0',
        project: '汪工',
        departure: '杭州',
        startData: '2018-7-27',
        togetherPerson: '3',
        endData: '2018-7-29',
        daySum: '1',
        Vehicle: '动车',
        ticketSum: '3',
        remarks: '无',
      },
      {
        key: '0',
        project: '申工',
        departure: '义务',
        startData: '2018-7-27',
        togetherPerson: '3',
        endData: '2018-7-29',
        daySum: '1',
        Vehicle: '高铁',
        ticketSum: '3',
        remarks: '无',
      },
    ],
    count: 2,
    choiceCusVisible: false,
    getCusValue: '客户A',
    constructUnitVisible: false,
    getConstructUnitValue: '施工单位A',
    openKeys: ['sub1'],
    choiceTypeKey: `0`,
    choiceTypeValue:``,
    current: 0,
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.handleBillSourceChange();
    this.handleCheckBoxChange();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  onCellChange = (key, dataIndex) => {
    return value => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource });
      }
    };
  };
  rootSubmenuKeys = ['sub1'];
  onDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };
  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };
  handleGetBillSourceValue = val => {
    this.setState({
      BillSourceValue: val,
    });
  };

  handleBillSourceChange = () => {
    const optionData = BillSourceOption.map((data, index) => {
      const val = `${data}`;
      return <Option key={val}>{val}</Option>;
    });
    this.setState({
      BillSourceOptionData: optionData,
    });
  };

  handleChoiceCusVisible = flag => {
    this.setState({
      choiceCusVisible: !!flag,
    });
  };

  handleGetCusValue = cus => {
    this.setState({
      getCusValue: cus,
    });
  };

  handleConstructUnitVisible = flag => {
    this.setState({
      constructUnitVisible: !!flag,
    });
  };

  handleGetConstructUnitValue = unit => {
    this.setState({
      getConstructUnitValue: unit,
    });
  };

  handleCheckBoxChange = () => {
    this.setState({
      CusOptionData: CheckBoxOption.map(data => {
        const val = `${data}`;
        return <Option key={val}>{val}</Option>;
      }),
    });
  };

  handleGetCusSelectValue = val => {
    console.log(val);
  };

  handleGetMenuValue = MenuValue => {
    this.setState({
      choiceTypeKey: MenuValue.key,
      current: 0,
      choiceTypeValue: MenuValue.item.props.children,
    });
    console.log(this.state.choiceTypeKey);
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      remarks: `London, Park Lane no. ${count}`,
      project: `小杨 ${count}`,
      departure: '新昌',
      startData: '2018-7-26',
      togetherPerson: '3',
      endData: '2018-7-29',
      daySum: '1',
      Vehicle: '大巴',
      ticketSum: '3',
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  treeMenu() {
    const { SubMenu } = Menu;
    return (
      <Menu
        mode="inline"
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        style={{ width: 140 }}
        onClick={this.handleGetMenuValue}
        defaultSelectedKeys={['0']}
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <span>项目步骤</span>
            </span>
          }
        >
          <Menu.Item key="0">项目信息管理</Menu.Item>
          <Menu.Item key="1">项目实施管理</Menu.Item>
          <Menu.Item key="2">项目成果管理</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }

  handleCallBack = (StepOption, item) => {
    StepOption.map((key,index) => {
      if(key.title === item.title){
        const current = index;
        this.setState({ current });
      }
    });
  };

  handleNext = (flag) => {
    if(flag) {
      const current = this.state.current + 1;
      this.setState({ current });
    }
  };


  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const {
      form,
      dispatch,
      submitting,
      proAddVisible,
      handleProAddVisible,
      choiceTypeValue,
      rowInfo,
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const {
      BillSourceOptionData,
      dataSource,
      choiceCusVisible,
      getCusValue,
      constructUnitVisible,
      getConstructUnitValue,
      BillSourceValue,
      CusOptionData,
      current,
      choiceTypeKey,
    } = this.state;
    const onCancel = () => {
      handleProAddVisible(false);
    };
    const columns = [
      {
        title: '项目',
        dataIndex: 'project',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'name')} />
        ),
      },
      {
        title: '出发地',
        dataIndex: 'departure',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'type')} />
        ),
      },
      {
        title: '出发时间',
        dataIndex: 'startData',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'mobilePhone')} />
        ),
      },
      {
        title: '同行人数',
        dataIndex: 'togetherPerson',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'officePhone')} />
        ),
      },
      {
        title: '结束时间',
        dataIndex: 'endData',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'officePhone')} />
        ),
      },
      {
        title: '天数',
        dataIndex: 'daySum',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'officePhone')} />
        ),
      },
      {
        title: '交通工具',
        dataIndex: 'Vehicle',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'officePhone')} />
        ),
      },
      {
        title: '票数',
        dataIndex: 'ticketSum',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'officePhone')} />
        ),
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'officePhone')} />
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return this.state.dataSource.length > 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
              <a href=" ">删除</a>
            </Popconfirm>
          ) : null;
        },
      },
    ];
    const parentMethods = {
      handleChoiceCusVisible: this.handleChoiceCusVisible,
      handleGetCusValue: this.handleGetCusValue,
      handleConstructUnitVisible: this.handleConstructUnitVisible,
      handleGetConstructUnitValue: this.handleGetConstructUnitValue,
    };
    const stepMethods = {
      handleNext: this.handleNext,
    } ;
    const StepOption1 = [
      { title: '项目信息', content: <Step1 {...stepMethods} />},
      { title: '人员分配', content: <Step2 {...stepMethods} />},
      { title: '资料上传', content: <Step3 {...stepMethods} />},
      { title: '实施方案', content: <Step4 {...stepMethods} />},
    ];
    const StepOption2 = [
      { title: '项目进度管理', content: <Step6 {...stepMethods} />},
      { title: '项目函件管理', content: <Step7 {...stepMethods} />},
      { title: '现场踏勘管理', content: <Step8 {...stepMethods} />},
      { title: '重大会审纪要', content: <Step13 {...stepMethods} />},
    ];
    const StepOption3 = [
      { title: '报告文印/盖章', content: <Step9 {...stepMethods} />},
      { title: '项目归档', content: <Step10 {...stepMethods} />},
      { title: '生成知识体系', content: <Step11 {...stepMethods} />},
      { title: '审批信息', content: <Step12 {...stepMethods} />},
    ];


    return (
      <Modal
        /*destroyOnClose="true"*/
        keyboard={false}
        title="项目基本信息新增"
        style={{ top: 20 }}
        visible={proAddVisible}
        width="85%"
        maskClosable={false}
        onCancel={onCancel}
        okText="提交"
        footer={null}
      >
        <div>
          <Card bordered={false}>
            <Layout style={{ padding: '24px 0', background: '#fff' }} >
              <Sider width={140} style={{ background: '#fff' }}>
                {this.treeMenu()}
              </Sider>
              <Content style={{ padding: '0 24px', minHeight: 280 }} >
                <div className={styles.tableList}>
                  <div className={styles.tableListForm}>
                    {(
                      choiceTypeKey === `0` && (
                        <Steps current={current} className={styles.steps} >
                          {StepOption1.map(item => <Step key={item.title} title={item.title} onClick={() => this.handleCallBack(StepOption1, item)} />)}
                        </Steps>
                      )
                    )}
                    {(
                      choiceTypeKey === `1` && (
                        <Steps current={current} className={styles.steps} >
                          {StepOption2.map(item => <Step key={item.title} title={item.title} onClick={() => this.handleCallBack(StepOption2, item)} />)}
                        </Steps>
                      )
                    )}
                    {(
                      choiceTypeKey === `2` && (
                        <Steps current={current} className={styles.steps} >
                          {StepOption3.map(item => <Step key={item.title} title={item.title} onClick={() => this.handleCallBack(StepOption3, item)} />)}
                        </Steps>
                      )
                    )}
                  </div>
                  <div className={styles["steps-action"]}>
                    {(
                      choiceTypeKey === `0` && (
                        StepOption1[current].content
                      )
                    )}
                    {(
                      choiceTypeKey === `1` && (
                        StepOption2[current].content
                      )
                    )}
                    {(
                      choiceTypeKey === `2` && (
                        StepOption3[current].content
                      )
                    )}
                  </div>
                </div>
              </Content>
            </Layout>
          </Card>
          <ChoiceCusModal {...parentMethods} choiceCusVisible={choiceCusVisible} />
          <ConstructUnitModal {...parentMethods} constructUnitVisible={constructUnitVisible} />
        </div>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(ProjectAddModal));
