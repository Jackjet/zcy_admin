import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  Input,
  Select,
  Popover,
  Modal,
  message,
  TreeSelect,
} from 'antd';
import { connect } from 'dva';

import styles from './style.less';


const isBranchOption = ['否', '是'];
const { Option } = Select;
const { TextArea } = Input;
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

class OrgUnitEditModal extends PureComponent {
  state = {
    width: '100%',
    isBranchOptionData: '',
    treeData: [],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.handleProjectChange();
    const { dispatch } = this.props;
    dispatch({
      type: 'company/getLeftTreeMenu',
      callback: (res) => {
        if(res.meta.status === '000000' ) {
          this.setState({treeData : res.data.list});
          this.props.handleGetBackVal(res);
        } else {
          message.error(res.meta.errmsg);
        }
      },
    });
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  onOrgTreeSelectChange = (value) => {
    console.log(value);

  };

  handleProjectChange = () => {
    const optionData = isBranchOption.map((data, index) => {
      const val = `${data}`;
      const keyWord = `${index}`;
      return <Option key={keyWord} value={keyWord}>{val}</Option>;
    });
    this.setState({
      isBranchOptionData: optionData,
    });
  };

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const { form, dispatch, OrgUnitEditVisible, handleOrgUnitEditVisible, rowInfo, currentPagination } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const { isBranchOptionData } = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'company/update',
            payload: {
              ...values,
              id: rowInfo.id,
              uid: JSON.parse(localStorage.getItem("user")).id,
            },
            callback: (res) => {
              if(res.meta.status !== '000000' ) {
                message.error(res.meta.alert_msg)
              } else {
                dispatch({
                  type: 'company/fetch',
                  payload: {},
                });
                handleOrgUnitEditVisible(false);
              }
            },
          });
        }
      });
    };
    const cancelDate = () => {
      handleOrgUnitEditVisible(false);
    };
    return (
      <Modal
        destroyOnClose="true"
        keyboard={false}
        title="组织机构基本信息编辑"
        style={{ top: 20 }}
        visible={OrgUnitEditVisible}
        width="55%"
        maskClosable={false}
        onOk={validate}
        onCancel={cancelDate}
        okText='提交'
      >
        <Card>
          <Form layout="horizontal">
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="组织名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入组织名称' }],
                    initialValue:`${rowInfo.name}`,
                  })(
                    <Input placeholder="请输入组织名称" />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item {...formItemLayout} label="上级组织">
                  {getFieldDecorator('parentId', {
                    rules: [{ required: true, message: '请选择上级组织' }],
                    initialValue: rowInfo.parentId,
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={this.state.treeData}
                      placeholder="请选择上级组织"
                      treeDefaultExpandAll
                      onChange={this.onOrgTreeSelectChange}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="组织编码">
                  {getFieldDecorator('number', {
                    rules: [{ required: true, message: '请输入组织编码' }],
                    initialValue:`${rowInfo.number}`,
                  })(
                    <Input readOnly placeholder="请输入组织编码" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="是否分公司">
                  {getFieldDecorator('isBranch', {
                    rules: [{ required: true, message: '是否分公司' }],
                    initialValue:`${rowInfo.isBranch}`,
                  })(
                    <Select placeholder="是否分公司" >
                      <Option key={1} value="1">是</Option>
                      <Option key={0} value="0">否</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="简称">
                  {getFieldDecorator('simpleName', {
                    rules: [{ required: false, message: '请输入简称' }],
                  })(
                    <Input  placeholder="请输入简称" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="英文名称">
                  {getFieldDecorator('englishName', {
                    rules: [{ required: false, message: '请输入英文名称' }],
                  })(
                    <Input  placeholder="请输入英文名称" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="负责人">
                  {getFieldDecorator('principal', {
                    rules: [{ required: false, message: '请选择负责人' }],
                    initialValue:`${rowInfo.principal}`,
                  })(
                    <Input placeholder="请选择负责人"  />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="联系人">
                  {getFieldDecorator('linkMan', {
                    rules: [{ required: false, message: '请输入联系人' }],
                  })(
                    <Input  placeholder="请输入联系人" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="移动电话">
                  {getFieldDecorator('mobilePhone', {
                    rules: [{ required: false, message: '请输入移动电话' }],
                  })(
                    <Input  placeholder="请输入移动电话" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="电话">
                  {getFieldDecorator('phone', {
                    rules: [{ required: false, message: '请输入电话' }],
                  })(
                    <Input  placeholder="请输入电话" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="电子邮箱">
                  {getFieldDecorator('enterpriseEmail', {
                    rules: [{ required: false, message: '请输入电子邮箱' }],
                    initialValue:`${rowInfo.enterpriseEmail}`,
                  })(
                    <Input  placeholder="请输入电子邮箱" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="邮政编码">
                  {getFieldDecorator('postalCode', {
                    rules: [{ required: false, message: '请输入邮政编码' }],
                    initialValue:`${rowInfo.postalCode}`,
                  })(
                    <Input  placeholder="请输入邮政编码" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="传真">
                  {getFieldDecorator('fax', {
                    rules: [{ required: false, message: '请输入传真' }],
                    initialValue:`${rowInfo.fax}`,
                  })(
                    <Input  placeholder="请输入传真" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="海关编码">
                  {getFieldDecorator('customsCode', {
                    rules: [{ required: false, message: '请输入海关编码' }],
                    initialValue:`${rowInfo.customsCode}`,
                  })(
                    <Input  placeholder="请输入海关编码" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="EDI编码">
                  {getFieldDecorator('ediNum', {
                    rules: [{ required: false, message: '请输入EDI编码' }],
                    initialValue:`${rowInfo.ediNum}`,
                  })(
                    <Input  placeholder="请输入EDI编码" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="税务编码">
                  {getFieldDecorator('taxCode', {
                    rules: [{ required: false, message: '请输入税务编码' }],
                    initialValue:`${rowInfo.taxCode}`,
                  })(
                    <Input  placeholder="请输入税务编码" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="详细地址">
                  {getFieldDecorator('address', {
                    rules: [{ required: false, message: '请输入详细地址' }],
                  })(
                    <TextArea  placeholder="请输入详细地址" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="网站首页">
                  {getFieldDecorator('url', {
                    rules: [{ required: false, message: '请输入网站首页' }],
                    initialValue:`${rowInfo.url}`,
                  })(
                    <Input  placeholder="请输入网站首页" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={21} pull={3}>
                <Form.Item {...formItemLayout} label="备注">
                  {getFieldDecorator('remarks', {
                    rules: [{ required: false, message: '备注' }],
                    initialValue:`${rowInfo.remarks}`,
                  })(
                    <TextArea  placeholder="请输入备注信息" rows={2} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['company/update'],
}))(Form.create()(OrgUnitEditModal));
