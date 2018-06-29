import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input } from 'antd';
import { connect } from 'dva';
import styles from './DictTypeAdd.less';

const { TextArea } = Input;
const fieldLabels = {
  number: '客户编码',
  code: '编码',
  name: '客户名称',
  dateRange: '生效日期',
  remarks: '备注',
  dictTypeName: '字典类别名称',
  status: '状态',
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12, offset: 1 },
    md: { span: 10 },
  },
};

class DictTypeAdd extends PureComponent {
  state = {
    width: '90%',
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
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <Card>
          <Form layout="horizontal">
            <Row className={styles['row-h']}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.code}>
                  {getFieldDecorator('code', {
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.dictTypeName}>
                  {getFieldDecorator('dictTypeName', {
                    rules: [{ required: true, message: '请选择字典类别名称' }],
                  })(<Input placeholder="请选择字典类别名称" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item {...formItemLayout} label={fieldLabels.remarks}>
                  {getFieldDecorator('remarks')(
                    <TextArea placeholder="请输入备注" style={{ minHeight: 32 }} rows={4} />
                  )}
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
}))(Form.create()(DictTypeAdd));
