import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Modal,TreeSelect ,Upload,Button,Icon } from 'antd';
import { connect } from 'dva';
import styles from './BillTableAdd.less';
import { message } from 'antd/lib/index';

const { TextArea } = Input;
const fieldLabels = {
  number: '编码',
  name: '表格名称',
  template: '模板',
  remarks: '说明',
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

const treeData = [{
  title: 'Node1',
  value: '0-0',
  key: '0-0',
  children: [{
    title: 'Child Node1',
    value: '0-0-1',
    key: '0-0-1',
  }, {
    title: 'Child Node2',
    value: '0-0-2',
    key: '0-0-2',
  }],
}, {
  title: 'Node2',
  value: '0-1',
  key: '0-1',
}];

class BillTableAdd extends PureComponent {
  state = {
    width: '90%',
    fileList: [],
    uploading: false,
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

  //（导入项目）上传文件变化时走的钩子函数
  handleChange = (info) => {
    console.log('info-->', info)
    const isxlsx = info.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const isxls = "application/vnd.ms-excel";
    if (!isxls && !isxlsx) {
      message.error('仅支持xls xlsx');
    }
    const isLt1M = info.file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('文件限制1G 以下');
    }
    if (!((isxlsx || isxls) && isLt1M)) {
      return false;
    }
    let formData = new FormData()
    formData.append('file', info.file, info.file.name)

  }
  //上传之前校验
  beforeUpload = (file) => {
    return false
  }

  render() {
    const { dispatch, modalVisible, form, handleAdd, handleModalVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          message.success('添加成功');
          form.resetFields();
          handleModalVisible(false);
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
      action: '//jsonplaceholder.typicode.com/posts/',
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
        }));
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
                      <TreeSelect
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={treeData}
                        placeholder="请选择业务类型"
                        treeDefaultExpandAll
                        onChange={this.onOrgTreeSelectChange}
                      >
                      </TreeSelect>
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
                  <Form.Item {...formItemLayout} label={fieldLabels.remarks}>
                    {getFieldDecorator('remarks')(
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
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(BillTableAdd));
