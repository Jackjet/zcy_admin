import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Modal,Select, message } from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import SeniorModal from '../../../components/MoveModal/index';

const { Option } = Select;
const { TextArea } = Input;
const fieldLabels = {
  number: '编码',
  name: '名称',
  remark: '备注',
  dictType: '字典类别',
  dictName: '字典名称',
  status: '状态',
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

class DictAdd extends PureComponent {
  state = {
    width: '90%',
    DictTypeOptionData:'',
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.handleDictOption();
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

  // 下拉选择change事件
  handleDictValueChange = (val) =>{
    console.log(val);
  };

  // 初始化 获取所有的字典类型
  handleDictOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dict/getAllDictType',
      payload: {
        page: 1,
        pageSize: 9999,
      },
      callback: (res) => {
        console.log(res.data.list);
        if(res.meta.status !== '000000' ) {
          message.error("获取数据字典类型失败!"+res.data.alert_msg)
        }else{
          // 使用箭头函数
          const optionData = res.data.list.map((data) => {
            return <Option key={data.id} value={data.id}>{data.name}</Option>;
          });
          this.setState({
            DictTypeOptionData: optionData,
          });
        }
      },
    });

  };


  render() {
    const { dispatch, modalVisible, form, handleModalVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          dispatch({
            type: 'dict/add',
            payload: values,
            callback: (res) => {
              if(res.meta.status !== '000000' ) {
                message.error("添加数据字典错误，请稍后再试！"+res.data.alert_msg)
              }else{
                //
                form.resetFields();
                handleModalVisible(false);

                dispatch({
                  type: 'dict/fetch',
                  payload: {
                    page: 1,
                    pageSize: 10,
                  }
                });
              }
            },
          });


        }
      });
    };
    /*const errors = getFieldsError();
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
    };*/
    const cancelDate = () => {
      form.resetFields();
      handleModalVisible(false);
    };
    return (
      <div>
        <SeniorModal
          title="数据字典新增"
          style={{ top: 20 }}
          visible={modalVisible}
          width="35%"
          maskClosable={false}
          onOk={validate}
          onCancel={cancelDate}
        >
          <Card>
            <Form layout="horizontal">
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.number}>
                    {getFieldDecorator('number', {
                      rules: [{ required: true, message: '请输入编码' }],
                    })(<Input placeholder="请输入编码" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.dictType}>
                    {getFieldDecorator('dictTypeId', {
                      rules: [{ required: true, message: '请选择字典类别' }],
                    })(
                      <Select
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        onChange={this.handleDictValueChange}
                        placeholder="请选择字典类别"
                        style={{ width: '100%' }}
                      >
                        {this.state.DictTypeOptionData}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.name}>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入字典名称' }],
                    })(<Input placeholder="请输入字典名称" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.remark}>
                    {getFieldDecorator('remark')(
                      <TextArea placeholder="请输入备注" style={{ minHeight: 32 }} rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </SeniorModal>
      </div>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['dict/add'],
}))(Form.create()(DictAdd));
