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
  InputNumber,
  Select,
  Popover,
  Cascader,
} from 'antd';
import { connect } from 'dva';

import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;


function onChange(value) {
  console.log(value);
}

const remarkcol = {
  wrapperCol: {
    style: {
      width: '91.66666667%',
    },
  },
  style: {
    width: '88%',
    paddingLeft: 38,
  },
};

class departmentAdd2 extends PureComponent {
  state = {
    width: '100%',
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = fieldKey => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    return (
      <div>
        <Card>
          <Form layout="inline">

            <Row className={styles['row-h']}>
              <Col span={12}>
                 <Form.Item  label="部门名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入部门名称' }],
                  })(<Input placeholder="请输入部门名称"  style={{width:200}} />)}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="上级部门" style={{paddingLeft:12}}>
                  {getFieldDecorator('parentOrg', {
                    rules: [{ required: true, message: '请选择上级部门' }],
                  })(
                    <Select  style={{ width: 200 }}>
                      <Option value="0">请选择</Option>
                      <Option value="g">至诚</Option>
                      <Option value="y">事务所有限公司</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item  label="部门编码">
                  {getFieldDecorator('number', {
                    rules: [{ required: true, message: '请输入部门编码' }],
                  })(<Input placeholder="请输入部门编码"  style={{width:200}}/>)}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item  label="所属组织" style={{paddingLeft:12}}>
                  {getFieldDecorator('orgunit', {
                    rules: [{ required: true, message: '所属组织' }],
                  })(
                    <Select  style={{ width: 200 }}>
                      <Option value="0">否</Option>
                      <Option value="1">是</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item  label="简称" style={{paddingLeft:35}}>
                  {getFieldDecorator('simpleName', {
                    rules: [{ required: false, message: '请输入简称' }],
                  })(<Input placeholder="请输入简称"  style={{width:200}} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item  label="英文名称"  style={{paddingLeft:22}}>
                  {getFieldDecorator('englishName', {
                    rules: [{ required: false, message: '请输入英文名称' }],
                  })(<Input placeholder="请输入英文名称" style={{width:200}} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item  label="负责人" style={{paddingLeft:24}}>
                  {getFieldDecorator('principal', {
                    rules: [{ required: false, message: '请选择负责人' }],
                  })(
                    <Select  style={{ width: 200 }}>
                      <Option value="0">员工A</Option>
                      <Option value="1">员工B</Option>
                    </Select>
                  )}
                </Form.Item>

              </Col>

              <Col span={12}>
                <Form.Item  label="联系人" style={{paddingLeft:35}}>
                  {getFieldDecorator('linkMan', {
                    rules: [{ required: false, message: '请输入联系人' }],
                  })(<Input placeholder="请输入联系人" style={{width:200}}  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item  label="移动电话" style={{paddingLeft:13}}>
                  {getFieldDecorator('mobilePhone', {
                    rules: [{ required: false, message: '请输入移动电话' }],
                  })(<Input placeholder="请输入移动电话" style={{width:200}}  />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item  label="电话"  style={{paddingLeft:47}}>
                  {getFieldDecorator('phone', {
                    rules: [{ required: false, message: '请输入电话' }],
                  })(<Input placeholder="请输入电话"  style={{width:200}}  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item  label="电子邮箱"  style={{paddingLeft:15}}>
                  {getFieldDecorator('email', {
                    rules: [{ required: false, message: '请输入电子邮箱' }],
                  })(<Input placeholder="请输入电子邮箱"  style={{width:200}}  />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item  label="邮政编码"  style={{paddingLeft:25}}>
                  {getFieldDecorator('postalCode', {
                    rules: [{ required: false, message: '请输入邮政编码' }],
                  })(<Input placeholder="请输入邮政编码" style={{width:200}}   />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item  label="传真"  style={{paddingLeft:39}}>
                  {getFieldDecorator('fax', {
                    rules: [{ required: false, message: '请输入传真' }],
                  })(<Input placeholder="请输入传真"  style={{width:200}}  />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item  label="海关编码"  style={{paddingLeft:25}}>
                  {getFieldDecorator('customsCode', {
                    rules: [{ required: false, message: '请输入海关编码' }],
                  })(<Input placeholder="请输入海关编码"  style={{width:200}}  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item  label="EDI编码"  style={{paddingLeft:22}}>
                  {getFieldDecorator('ediCode', {
                    rules: [{ required: false, message: '请输入EDI编码' }],
                  })(<Input placeholder="请输入EDI编码"  style={{width:200}}  />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item  label="税务编码"  style={{paddingLeft:25}}>
                  {getFieldDecorator('taxCode', {
                    rules: [{ required: false, message: '请输入税务编码' }],
                  })(<Input placeholder="请输入税务编码" style={{width:200}}  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={12}>
                <Form.Item  label="详细地址"  style={{paddingLeft:15}} >
                  {getFieldDecorator('address', {
                    rules: [{ required: false, message: '请输入详细地址' }],
                  })(<Input placeholder="请输入详细地址" style={{width:200}}   />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item  label="网站首页"  style={{paddingLeft:25}}>
                  {getFieldDecorator('url', {
                    rules: [{ required: false, message: '请输入网站首页' }],
                  })(<Input placeholder="请输入网站首页" style={{width:200}}   />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['fn-mb-15']}>
              <Col span={24}>
                <Form.Item {...remarkcol} label="备注">
                  {getFieldDecorator('remark')(<TextArea placeholder="请输入备注信息" rows={2} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(departmentAdd2));
