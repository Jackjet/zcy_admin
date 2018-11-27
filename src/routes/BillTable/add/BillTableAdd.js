import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Modal,TreeSelect ,Select,Upload,Button,Icon } from 'antd';
import { connect } from 'dva';
import styles from './BillTableAdd.less';
import { message } from 'antd/lib/index';

const { Option } = Select;
const { TextArea } = Input;
const fieldLabels = {
  number: '编码',
  name: '表格名称',
  template: '模板',
  remark: '说明',
  billType: '业务类别',
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

class BillTableAdd extends PureComponent {
  state = {
    width: '90%',
    fileList: [],
    uploading: false,
    billTypeOption:'',
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.handleBillTableOption();
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

  // 初始化 获取所有的字典类型
  handleBillTableOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dict/fetch',
      payload: {
        page: 1,
        pageSize: 9999,
        dictTypeId:"65bfc4a9ed4c11e88ac1186024a65a7c",
      },
      callback: (res) => {
        console.log(res.data.list);
        if(res.meta.status !== '000000' ) {
          message.error("获取业务用表类型失败!"+res.data.alert_msg)
        }else{
          // 使用箭头函数
          const optionData = res.data.list.map((data) => {
            return <Option key={data.id} value={data.id}>{data.name}</Option>;
          });
          this.setState({
            billTypeOption: optionData,
          });
        }
      },
    });

  };


  //（导入项目）上传文件变化时走的钩子函数
  handleChange = (info) => {
    console.log('info-->', info)
    const isdocordocx = info.file.type === 'application/msword' ||  info.file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const ispdf = info.file.type === 'application/pdf';
    if (!isdocordocx && !ispdf) {
      message.error('仅支持doc pdf');
      return false;
    }
    const isLt1M = info.file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('文件限制1G 以下');
    }
    if (!((isdocordocx || ispdf) && isLt1M)) {
      return false;
    }

  }

  render() {
    const { dispatch, modalVisible, form, handleModalVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values

           const formData = new FormData()
           formData.append('file', values.template.file, values.template.file.name);
           formData.append('billTypeId',values.billType);
           formData.append('name',values.name);
           formData.append('number',values.number);
           formData.append('remark',values.remark);
          dispatch({
            type: 'billTable/add',
            payload: formData,
            callback: (res) => {
              if(res.meta.status !== '000000' ) {
                message.error("添加业务用表失败，请稍后再试！"+res.data.alert_msg)
              }else{
                //
                message.success('添加成功');
                form.resetFields();
                handleModalVisible(false);

                dispatch({
                  type: 'billTable/fetch',
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
    const cancelDate = () => {
      form.resetFields();
      handleModalVisible(false);
    };

    //附件模板
    const props = {
      name:"file",//发到后台的文件参数名
      onChange:this.handleChange,//上传文件改变时的状态
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        })) ;
        return false;
      },
      fileList: this.state.fileList,
    };

    return (
      <div>
        <Modal
          title="业务用表信息新增"
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
                  <Form.Item {...formItemLayout} label={fieldLabels.name}>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入名称' }],
                      initialValue : this.state.fileList[0]==null?"":this.state.fileList[0].name,
                    })(<Input placeholder="请输入名称" readOnly={true}/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.billType}>
                    {getFieldDecorator('billType', {
                      rules: [{ required: true, message: '请选择业务类型' }],
                    })(
                      <Select
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        onChange={this.handleDictValueChange}
                        placeholder="请选业务类型"
                        style={{ width: '100%' }}
                      >
                        {this.state.billTypeOption}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item {...formItemLayout} label={fieldLabels.template}>
                    {getFieldDecorator('template', {
                      rules: [{ required: true, message: '请选择模板' }],
                    })(
                      <Upload {...props} >
                        <Button>
                          <Icon type="upload" /> 上传模板
                        </Button>
                    </Upload>)}
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
        </Modal>
      </div>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['billTable/add'],
}))(Form.create()(BillTableAdd));
