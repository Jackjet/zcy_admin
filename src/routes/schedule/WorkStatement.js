import React, { PureComponent, Fragment } from 'react';
import { List, Button, Tabs, Icon, Calendar, Badge, Card, Form, Row, Col, Input, DatePicker, Divider } from 'antd';
import { connect } from 'dva';
import StatementAddModal from './add/StatementAddModal2'
import StatementViewModal from './view/StatementViewModal'
import StatementReviewModal from './Review/StatementReviewModal'
import styles from './Style.less';
import StandardTable from '../../components/StandardTable';


const statusMap = ['success', 'error'];
const status = ['已阅', '未阅'];
const { TabPane } = Tabs;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

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
export default class WorkStatement extends PureComponent {

  state = {
    StatementAddVisible:false,
    StatementViewVisible:false,
    StatementReviewVisible:false,
    selectedRows: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };


  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStatementAddVisible = flag => {
    this.setState({
      StatementAddVisible:!!flag,
    });
  };

  handleStatementViewVisible = flag => {
    this.setState({
      StatementViewVisible:!!flag,
    });
  };

  handleStatementReviewVisible = flag => {
    this.setState({
      StatementReviewVisible:!!flag,
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="报告日期">
              {getFieldDecorator('no')(
                <DatePicker />
              )}
            </Form.Item>
          </Col>

          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                清除
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  };

  render() {
    const { rule: { data }, loading } = this.props;
    const { selectedRows, StatementAddVisible, StatementViewVisible, StatementReviewVisible } = this.state;
    const StatementAddMethods = {
      handleStatementAddVisible : this.handleStatementAddVisible,
    };
    const StatementViewMethods = {
      handleStatementViewVisible : this.handleStatementViewVisible,
    };
    const StatementReviewMethods = {
      handleStatementReviewVisible : this.handleStatementReviewVisible,
    };
    const columns = [
      {
        title: '类型',
        dataIndex: 'organizeCode',
      },
      {
        title: '报告人',
        dataIndex: 'organizeName',
      },
      {
        title: '报告日期',
        dataIndex: 'phone',
      },
      {
        title: '报告内容',
        dataIndex: 'fzperson',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        render: (text, record, index) => (
          <Fragment>
            {
              (`${record.status}` === `0`)&&(
                <a onClick={()=>this.handleStatementViewVisible(true,record)}>查看</a>
              )
            }

            {
              (`${record.status}` === `1`)&&(
                <a onClick={()=>this.handleStatementReviewVisible(true,record)}>审阅</a>
              )
            }
          </Fragment>
        ),
      },
    ];
    return (
      <div>
        <Card>
          <Tabs defaultActiveKey="1">
            <TabPane tab="我的报告" key="1">
              <div className={styles['ant-fullcalendar-header-buttonhz']}>
                <Button type="primary" onClick={() => this.handleStatementAddVisible(true)}>
                  新增报告
                </Button>
              </div>
              <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
            </TabPane>
            <TabPane tab="报告查阅" key="2">
              <div>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </TabPane>
          </Tabs>
          <StatementAddModal {...StatementAddMethods} StatementAddVisible={StatementAddVisible}  />
          <StatementViewModal {...StatementViewMethods} StatementViewVisible={StatementViewVisible} />
          <StatementReviewModal {...StatementReviewMethods} StatementReviewVisible={StatementReviewVisible} />
        </Card>
      </div>
    );
  }
}
