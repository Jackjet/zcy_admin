import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Col,
  Row,
  Input,
  Select,
  Modal,
  message,
  Icon,
  Popover,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { Option } = Select;
const { TextArea } = Input;
const ProjectTypeOption = ["工程造价业务项目","咨询报告","招标"];
const fieldLabels = {
  projectCode:'编码',
  projectType:'项目类别',
  projectName:'项目名称',
  year:'年度',
  explain:'说明',
};
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

class ContractAddModal extends PureComponent {
  state = {
    width: '100%',
    projectOptionData:[],
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleChoiceProjectType = () =>{
    const optionData = ProjectTypeOption.map((data, index) => {
      const value = `${data}`;
      return <Option value={value}>{value}</Option>;
    });
    this.setState({
      projectOptionData: optionData,
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
    const { form, dispatch, submitting, AllocationAddVisible, handleAllocationAddVisible } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const {projectOptionData} = this.state;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'rule/add',
            payload: values,
          });
          form.resetFields();
          message.success('添加成功');
          handleAllocationAddVisible(false);
        }
      });
    };
    const resetDate = () =>{
      form.resetFields();
      handleAllocationAddVisible(false);
    }
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
      <Modal
        title="新增项目分配"
        visible={AllocationAddVisible}
        width="75%"
        maskClosable={false}
        onOk={validate}
        onCancel={resetDate}
      >
        <div>
          <Card>
            <Form layout="horizontal">
              <Row className={styles['fn-mb-15']}>
                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.projectCode}>
                    {getFieldDecorator('projectCode', {
                      rules: [{ required: true, message: '不重复的数字自动生成' }],
                    })(
                      <Input placeholder="不重复的数字自动生成" style={{width:'100%'}} />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.projectType}>
                    {getFieldDecorator('projectType', {
                      rules: [{ required: true, message: '请选择工程类别' }],
                    })(
                      <Select onMouseEnter={this.handleChoiceProjectType} placeholder="请选择合同类别" style={{width:'100%'}} >
                        {projectOptionData}
                      </Select>
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item {...formItemLayout} label={fieldLabels.year}>
                    {getFieldDecorator('year', {
                      rules: [{ required: true, message: '请选择年度' }],
                    })(
                      <Select placeholder="请选择年度" style={{width:'100%'}} >
                        <Option value="xiao">请选择</Option>
                        <Option value="z">2018</Option>
                        <Option value="f">2019</Option>
                        <Option value="fd">2020</Option>
                        <Option value="sn">2021</Option>
                        <Option value="zf">2022</Option>
                        <Option value="sy">2023</Option>
                        <Option value="jr">2024</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={5}>
                  <Form.Item {...formItemLayout} label={fieldLabels.projectName}>
                    {getFieldDecorator('projectName', {
                      rules: [{ required: true, message: '请输入项目名称' }],
                    })(
                      <Input placeholder="请输入项目名称" style={{width:'100%'}} />
                    )}
                  </Form.Item>
                </Col>
              </Row>


              <Row className={styles['fn-mb-15']}>
                <Col span={23} pull={5}>
                  <Form.Item {...formItemLayout} label={fieldLabels.explain}>
                    {getFieldDecorator('explain', {
                      rules: [{ required: false, message: '说明' }],
                    })(
                      <TextArea placeholder="请输入说明" rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </Modal>

    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(ContractAddModal));
