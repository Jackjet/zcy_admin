import React, { PureComponent } from 'react';
import {
  Form,
  Icon,
  Col,
  Row,
  Popover,
  Collapse,
  Upload,
  Button,
  Table,
  message,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { Panel } = Collapse;
const uploadProps = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  showUploadList:false,
  onChange:this.handleChange,
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

class UploadDemo extends PureComponent {
  state = {
    width: '100%',
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleUploadFile = (info)=>{
    console.log(`${info.file.name}+1111`)
  };

  handleChange = (info)=>{
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      console.log(`${info.file.name}`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      this.handleUploadFile(info);
      console.log(`${info.file.name}`)
    }
  };


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
    const columns = [{
      title: '文件名称',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    }, {
      title: '操作',
      dataIndex: 'age',
      key: 'age',
      render: text => <a>{text}</a>,
    }, {
      title: '版本',
      dataIndex: 'address',
      key: 'address',
      render: text => <a>{text}</a>,
    }];
    const data = [{
      key: '1',
      name: '文件1',
      age: '在线编辑',
      address: '3.0',
    }, {
      key: '2',
      name: '文件2',
      age: '在线编辑',
      address: '2.0',
    }, {
      key: '3',
      name: '文件3',
      age: '在线编辑',
      address: '1.0',
    }];
    return (
      <div>
        <Form layout="horizontal">
          <Collapse defaultActiveKey={['1','2']} >
            <Panel header="客户信息" key="1">
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label='底稿'>
                    {getFieldDecorator('customerCode', {
                      rules: [{ required: false, message: '请输入单位名称' }],
                    })(
                      <div>
                        <Upload {...uploadProps}>
                          <Button>
                            <Icon type="upload" /> 底稿
                          </Button>
                        </Upload>
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles['fn-mb-15']}>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label='底稿列表'>
                    {getFieldDecorator('customerCode', {
                      rules: [{ required: false, message: '请输入单位名称' }],
                    })(
                      <div>
                        <Table columns={columns} dataSource={data} />
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Form>
      </div>
    );
  }
}
export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(UploadDemo));
