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

const codeSpace = {
  style: {
    paddingLeft: 62,
  },
};

const dictTypeNameSpace = {
  style: {
    paddingLeft: 12,
  },
};

const remarksSpace = {
  style: {
    paddingLeft: 70,
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
          <Form layout="inline">
            <Row className={styles['row-h']}>
              <Col span={24}>
                <Form.Item {...codeSpace} label={fieldLabels.code}>
                  {getFieldDecorator('code', {
                    rules: [{ required: true, message: '请输入编码' }],
                  })(<Input placeholder="请输入编码" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={24}>
                <Form.Item {...dictTypeNameSpace} label={fieldLabels.dictTypeName}>
                  {getFieldDecorator('dictTypeName', {
                    rules: [{ required: true, message: '请选择字典类别名称' }],
                  })(<Input placeholder="请选择字典类别名称" style={{ width: 200 }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles['row-h']}>
              <Col span={24}>
                <Form.Item {...remarksSpace} label={fieldLabels.remarks}>
                  {getFieldDecorator('remarks')(
                    <TextArea placeholder="请输入备注" style={{ width: 200, height: 100 }} />
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
