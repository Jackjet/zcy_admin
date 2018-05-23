import React, { PureComponent } from 'react';
import {List,  Tabs, Icon, Calendar,Badge } from 'antd';


const TabPane = Tabs.TabPane;

function callback(key) {
  console.log(key);
}


function getListData(value) {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: '项目A（内勤）.' },
        { type: 'success', content: '项目B (内勤)' },
      ]; break;
    case 10:
      listData = [
        { type: 'warning', content: '项目B (外勤)' },
        { type: 'success', content: '项目B (外勤)' },
        { type: 'error', content: '项目B (内勤)' },
      ]; break;
    case 15:
      listData = [
        { type: 'warning', content: '项目（外勤）' },
        { type: 'success', content: '项目（外勤）' },
        { type: 'error', content: '项目（外勤）.' },
        { type: 'error', content: '。。。.' },
        { type: 'error', content: '。。。' },
        { type: 'error', content: '。。。.' },
      ]; break;
    default:
  }
  return listData || [];
}

function dateCellRender(value) {
  const listData = getListData(value);
  return (
    <ul className="events">
      {
        listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))
      }
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

export default class CalendarAll extends PureComponent {

  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane  tab="我的日程"  key="1">
            <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
        </TabPane>
          <TabPane tab="部门人员日程情况" key="2">
            <h1>Hello World!</h1>
          </TabPane>

        </Tabs>
      </div>

    );
  }
}
