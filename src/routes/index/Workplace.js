import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Link,routerRedux } from 'dva/router';
import DataSet from '@antv/data-set';
import { Row, Col, Card, List, Avatar, Tabs, Icon, Calendar ,Badge,Button} from 'antd';
import { Chart, Axis, Geom, Tooltip, Coord, Label, Legend, Guide } from 'bizcharts';
import { Bar } from '../../components/Charts';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Workplace.less';



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
    formatter: (val) => {
      val = (val * 100) + '%';
      return val;
    },
  },
};


let tolink = 'schedule/notice';


function callback(key){
  console.log(key);
  if(key == "notice"){
    tolink = 'schedule/notice';
  }

}


@connect(({ project, activities, chart, loading }) => ({
  project,
  activities,
  chart,
  projectLoading: loading.effects['project/fetchNotice'],
  activitiesLoading: loading.effects['activities/fetchList'],
}))
export default class Workplace extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/fetchNotice',
    });
    dispatch({
      type: 'activities/fetchList',
    });
    dispatch({
      type: 'chart/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }





  handlelink = () =>{
    this.props.dispatch(routerRedux.push(tolink));
  };

  handleClick = () =>{
    alert(11111111111111);
  };

  handleArea = () =>{
    window.scrollTo(0,0)
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
            avatar={<Avatar src={item.user.avatar} />}
            title={
              <span>
                <a className={styles.username}>{item.user.name}</a>
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



    const morecharts =<a onClick={() =>this.handlelink()}><span style={{paddingRight:15}}>更多图表</span></a>;

    const moremessage =<a onClick={() =>this.handlelink()}><span style={{paddingRight:15}}>更多</span> </a>;

    const {
      activitiesLoading,
      chart,
    } = this.props;

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="large"
            src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>早安，申杰东，祝你开心每一天！</div>
          <div>技术专家 | 至诚软件－研发中心－某某平台部－某某技术部－UED</div>
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
          <p>
            50
          </p>
        </div>
        <div className={styles.statItem}>
          <p>已完成</p>
          <p>
            6
          </p>
        </div>
        <div className={styles.statItem}>
          <p>合同金额</p>
          <p>
            2,000,000
          </p>
        </div>
        <div className={styles.statItem}>
          <p>应收款金额</p>
          <p>2,223,000</p>
        </div>
      </div>
    );

    const {
      contractData,
    } = chart;

    const cols = {
      'sales': {tickInterval: 20},
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
      pageSizeOptions: ['5','10','15','20'],
      total: 50,
    };

    return (
      <PageHeaderLayout content={pageHeaderContent} extraContent={extraContent}>
        <div style={{fontSize: 20, marginTop: 20 , marginBottom: 20, color: "black" }}>
          近期事物
        </div>
        <Card style={{marginBottom: 20}}>
          <div style={{fontSize: 20, margin:"center", paddingBottom: 15}}>
            待处理事物
          </div>

          <Row gutter={32}>
            <Col span={6}>
              <Badge count={0}>
                <div className={styles["gutter-box1"]}>
                  <h3 >项目审批</h3>
                  <br />
                  <p>
                    0个待审批的项目
                  </p>
                </div>
              </Badge>
            </Col>
            <Col span={6}>
              <Badge count={3}>
                <div className={styles["gutter-box2"]} >
                  <h3 >合同审批</h3>
                  <br />
                  <p>
                    3个待审批的合同
                  </p>
                </div>
              </Badge>
            </Col>
            <Col span={6}>
              <Badge count={1}>
                <div className={styles["gutter-box3"]} >
                  <h3 >费用审批</h3>
                  <br />
                  <p>
                    1个待审批的费用
                  </p>
                </div>
              </Badge>
            </Col>
            <Col span={6}>
              <Badge count={10}>
                <div className={styles["gutter-box4"]} >
                  <h3>请假审批</h3>
                  <br />
                  <p>
                    10个待审批的请假
                  </p>
                </div>
              </Badge>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col span={6}>
              <Badge count={6}>
                <div className={styles["gutter-box5"]} >
                  <h3>报销审批</h3>
                  <br />
                  <p>
                    6个待审批的报销
                  </p>
                </div>
              </Badge>
            </Col>
          </Row>
        </Card>
        <div style={{fontSize: 20, marginBottom: 20, color: "black" }}>
          快捷常用工具
        </div>
        <Card style={{marginBottom: 20}}>
          <Row gutter={32}>
            <Col span={4}>
              <Link
                className={styles["shortcut-box1"]}
                to="/crm/customer"
                onClick={this.handleArea}
              >
                <div ><Icon className={styles.iconhz}  type="star" />
                </div>
                <h5 >客户信息管理</h5>
              </Link>
            </Col>
            <Col span={4}>
              <Link
                className={styles["shortcut-box2"]}
                to='/project/projectinfo'
                onClick={this.handleArea}
              >
                <div ><Icon className={styles.iconhz}  type="star" />
                </div>
                <h5 >项目信息管理</h5>
              </Link>
            </Col>
            <Col span={4}>
              <Link
                className={styles["shortcut-box3"]}
                to='/schedule/schedulelist'
                onClick={this.handleArea}
              >
                <div ><Icon className={styles.iconhz}  type="star" />
                </div>
                <h5 >日常管理</h5>
              </Link>
            </Col>
            <Col span={4}>
              <Link
                className={styles["shortcut-box4"]}
                to="/HR/organize"
                onClick={this.handleArea}
              >
                <div ><Icon className={styles.iconhz}  type="star" />
                </div>
                <h5 >组织结构</h5>
              </Link>
            </Col>
            <Col span={4}>
              <Link
                className={styles["shortcut-box5"]}
                to="/ExpenseReimbursement/ExpenseApply"
                onClick={this.handleArea}
              >
                <div ><Icon className={styles.iconhz}  type="star" />
                </div>
                <h5 >费用申请单</h5>
              </Link>
            </Col>
            <Col span={4} />
          </Row>
        </Card>
        <Row gutter={24} className={styles["row-h"]}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24, height: "auto" }}
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <Tabs defaultActiveKey="notice" onChange={this.callback}  tabBarExtraContent={moremessage}>
                <TabPane
                  tab={
                    <span>
                      <Icon type="notification" />公告通知
                    </span>
                  }
                  key="notice"
                >
                  <List
                    loading={activitiesLoading}
                    size="large"
                  >
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
                  <List
                    loading={activitiesLoading}
                    size="large"
                  >
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
                  <List
                    loading={activitiesLoading}
                    size="large"
                  >
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
                >
                  <List
                    loading={activitiesLoading}
                    size="large"
                    /*pagination={paginationProps}*/
                  >
                    <div className={styles.activitiesList}>{this.renderActivities()}</div>
                  </List>
                </TabPane>
              </Tabs>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              bodyStyle={{ padding: 0, height: "auto" }}
              bordered={false}
              title="日程"
              loading={activitiesLoading}
            >
              <div className="calendar-all" id="homeCalendarCon">
                <Calendar fullscreen={false} />
              </div>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <Tabs defaultActiveKey="1" onChange={callback} tabBarExtraContent={morecharts}>
                <TabPane
                  tab={
                    <span>
                      <Icon type="pie-chart" />客户贡献度
                    </span>
                  }
                  key="1"
                >
                  <Row>
                    <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                      <Chart
                        width={500}
                        height={500}
                        data={dv}
                        scale={colsPie}
                        padding={[ 80, 100, 80, 80 ]}
                        onPlotClick={()=>this.handleClick()}
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
                    </Col>
                    <Col xl={12} lg={12} md={12} sm={24} xs={24}>
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
                    </Col>
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
                          <Tooltip showTitle={false} crosshairs={{type:"cross"}} />
                          <Geom
                            type="interval"
                            position="department*sales"
                            tooltip={['department*sales', (department, sales) => {
                              return {
                                name: department,
                                value:
                                '<br><span style="padding-left: 16px">项目总数：'+sales+'</span><br/>'
                                + '<span style="padding-left: 16px">在建：1</span><br/>'
                                + '<span style="padding-left: 16px">启动中：2</span><br/>'
                                + '<span style="padding-left: 16px">已归档：3</span>'};}]}
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
                        <Bar height={500} title="合同额趋势" data={contractData} />
                      </div>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
