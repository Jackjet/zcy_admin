import React, { PureComponent } from 'react';
import { List, Button, Tabs, Icon, Calendar, Badge, Card, Form } from 'antd';
import { connect } from 'dva';
import ScheduleAddModal from './ScheduleAddModal';
import styles from './calendarAll.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


const { TabPane } = Tabs;
function callback(key) {
  console.log(key);
}
//创建日程

function getListData(value) {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: '项目A（内勤）.' },
        { type: 'success', content: '项目B (内勤)' },
      ];
      break;
    case 10:
      listData = [
        { type: 'warning', content: '项目c (外勤)' },
        { type: 'success', content: '项目e (外勤)' },
        { type: 'error', content: '项目d (内勤)' },
      ];
      break;
    case 15:
      listData = [
        { type: 'warning', content: '项目a（外勤）' },
        { type: 'success', content: '项目m（外勤）' },
        { type: 'error', content: '项目n（外勤）.' },
        { type: 'error', content: '。。。w.' },
        { type: 'error', content: '。。w。' },
        { type: 'error', content: '。。r。.' },
      ];
      break;
    default:
  }
  return listData || [];
}

function dateCellRender(value) {
  const listData = getListData(value);
  return (
    <ul className="events">
      {listData.map(item => (
        <li key={item.content}>
          <Badge status={item.type} text={item.content} />
        </li>
      ))}
    </ul>
  );
}

function getMonthData(value) {
  if (value.month() === 8) {
    return 1394;
  }
}

function monthCellRender(value) {
  const num = getMonthData(value);
  return num ? (
    <div className="notes-month">
      <section>{num}</section>
      <span>Backlog number</span>
    </div>
  ) : null;
}

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class CalendarAll extends PureComponent {
  state = {
    ScheduleAddVisible:false,
  };
  handleScheduleAddVisible = (flag)=>{
    this.setState({
      ScheduleAddVisible:!!flag,
    });
  };
  render() {
    const { form, rule: { data }, loading } = this.props;
    const { ScheduleAddVisible } = this.state;
    const ScheduleAddMethods = {
      handleScheduleAddVisible: this.handleScheduleAddVisible,
    };
    return (
      <PageHeaderLayout>
        <Card>
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="我的日程" key="1">
              <div className={styles['ant-fullcalendar-header-buttonhz']}>
                <Button type="primary" htmlType="submit">
                  新增双周日程
                </Button>
                <Button type="primary" style={{ marginLeft: 8 }} onClick={()=>this.handleScheduleAddVisible(true)}>
                  新增日常
                </Button>
              </div>
              <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
            </TabPane>
            <TabPane tab="部门人员日程情况" key="2">
              <h1>Hello World!</h1>
            </TabPane>
          </Tabs>
          <ScheduleAddModal {...ScheduleAddMethods} ScheduleAddVisible={ScheduleAddVisible} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
