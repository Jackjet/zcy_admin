import React, { PureComponent, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Layout,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './BillTable.less';
import BillTableAdd from '../add/BillTableAdd';
import PageLeftTreeMenu from "../../../components/PageLeftTreeMenu";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;
const statusMap = ['success', 'error'];
const status = ['启用', '停用'];
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ billTable, loading }) => ({
  billTable,
  loading: loading.models.billTable,
}))
@Form.create()
export default class BillTable extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    openKeys: ['sub1'],
    billTableTypeTree:[],
    openKey: '',
    selectedKey:'',
    firstHide: true, // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'billTable/fetch',
      payload: {
        page: 1,
        pageSize: 10,
      },
      callback: (res) => {
        if(res.meta.status !== '000000' ) {
          message.error("查询出错，请稍后再试！")
        }else{
          //

        }
      },
    });
    // 查询树形结构
    dispatch({
      type: 'billTable/getDictTreeByTypeId',
      payload: {
        page: 1,
        pageSize: 9999,
        dictTypeId:"65bfc4a9ed4c11e88ac1186024a65a7c",
      },
      callback: (res) => {
        if(res.meta.status !== '000000' ) {
          message.error("获取类型失败！"+res.data.alert_msg)
        }else{
          this.setState({
            billTableTypeTree : res.data.list,
          });
        }
      },
    });
  }


// 左边树形菜单 点击事件
menuClick = e => {
  console.log(e.key);
  this.setState({
    selectedKey: e.key,
  });
  // 根据id 查询列表
  if(e.key){
    const { dispatch } = this.props;
    dispatch({
      type: 'dict/fetch',
      payload: {
        page: 1,
        pageSize: 10,
        dictTypeId:e.key,
      },
      callback: (res) => {
        if(res.meta.status !== '000000' ) {
          message.error("查询出错，请稍后再试！")
        }else{
          //
        }
      },
    });
  }
};

//左边树形菜单 打开收缩事件
openMenu = v => {
  this.setState({
    openKey: v[v.length - 1],
    firstHide: false,
  })
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
      type: 'billTable/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'billTable/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'billTable/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  view = (record) =>{
    const w=window.open('about:blank');
    w.location.href=record.url;
  }

// 下载 数据处理函数
  downloadFile = (record) =>{
    // 结合隐藏form表单进行react和post接口下载数据
    let divElement = document.getElementById('downloadDiv');
    ReactDOM.render(
      <form action="http://127.0.0.1:1801/api/fileUpload/downloadFile" method="post" target="_blank">
        <input name="fileName" type="text" value={record.name} />     // 变量参数值
        <input name="downurl" type="text" value={record.url} />
      </form>,
      divElement
    );
    ReactDOM.findDOMNode(divElement)
      .querySelector('form')
      .submit();
    ReactDOM.unmountComponentAtNode(divElement);
  };


    handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'billTable/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    this.props.dispatch({
      type: 'billTable/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  rootSubmenuKeys = ['sub1'];


  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('no')(<Input placeholder="编码名称模糊搜索" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  renderForm() {
    return this.state.expandForm ? this.renderSimpleForm() : this.renderSimpleForm();
  }

  render() {
    const { billTable: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const columns = [
      {
        title: '编码',
        dataIndex: 'number',
      },
      {
        title: '表格名称',
        dataIndex: 'name',
      },
      {
        title: '说明',
        dataIndex: 'remarks',
      },

      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.view(record)}>预览</a>
            <Divider type="vertical" />
            <a href={record.url} download={record.name}>下载</a>  {/*onClick={() => this.downloadFile(record)}*/}
            <Divider type="vertical" />
            <a href="">删除</a>
            <Divider type="vertical" />
            <a href="">编辑</a>
          </Fragment>
        ),
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={140} style={{ background: '#fff' }}>
              <PageLeftTreeMenu
                /*menus={router.menus}*/
                menus={this.state.billTableTypeTree}
                onClick={this.menuClick}
                mode="inline"
                selectedKeys={[this.state.selectedKey]}
                openKeys={this.state.firstHide ? null : [this.state.openKey]}
                onOpenChange={this.openMenu}
              />
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              {/* 隐藏的div Dom结构，用于存放临时form*/}
              <div id="downloadDiv" style={{ display: 'none' }} />

              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button
                    style={{ marginLeft: 8 }}
                    type="primary"
                    onClick={() => this.handleModalVisible(true)}
                  >
                    新建
                  </Button>
                  {selectedRows.length > 0 && (
                    <span>
                      <Dropdown overlay={menu}>
                        <Button>
                          批量删除 <Icon type="down" />
                        </Button>
                      </Dropdown>
                    </span>
                  )}
                </div>
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </Content>
          </Layout>
        </Card>
        <BillTableAdd {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
