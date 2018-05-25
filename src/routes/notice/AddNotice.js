import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import styles from './AddNotice.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class AddNotice extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const formItemLayoutwidth = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
        style:{width:'70%'}
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const fileList = [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }, {
      uid: -2,
      name: 'yyy.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }];

    const props2 = {
      action: '//jsonplaceholder.typicode.com/posts/',
      listType: 'picture',
      defaultFileList: [...fileList],
      className : styles["upload-list-inline"]
    };

    return (
      <div>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="公告标题">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入标题',
                  },
                ],
              })(<Input placeholder="请输入公告标题" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="所属栏目">
              {getFieldDecorator('borad', {
                rules: [{ required: true, message: '请选择栏目' }],
              })(
                <Select placeholder="请选择栏目" style={{ width: '100%' }}>
                  <Option value="0">请选择</Option>
                  <Option value="g">研发中心</Option>
                  <Option value="y">公司公告</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="下达范围">
              {getFieldDecorator('released', {
                rules: [{ required: true, message: '请选择下达范围' }],
              })(
                <Select placeholder="请选择下达范围" style={{ width: '100%' }}>
                  <Option value="0">请选择</Option>
                  <Option value="g">下达员工</Option>
                  <Option value="y">下达部门</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="下达选择">
              <Button type="primary" htmlType="submit" loading={submitting}>
                选择部门或者员工
              </Button>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="公告详情" >
              {getFieldDecorator('client')(
                <Input placeholder="富文本框" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="公告排序" >
              {getFieldDecorator('public', {
                initialValue: '2',
              })(
                <Radio.Group>
                  <Radio value="1">置顶</Radio>
                  <Radio value="2">不置顶</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutwidth}
              label="公告附件">
              {getFieldDecorator('Attachment ', {
                initialValue: '2',
              })(
                <Upload {...props2}>
                  <Button type="primary">
                    <Icon type="upload" /> 上传附件
                  </Button>
                  <span>*只能上传pdf;doc/docx;xls/xlsx;ppt/pptx;txt/jpg/png/gif，最多上传5个附件</span>
                </Upload>
              )}
            </FormItem>


          </Form>
        </Card>
      </div>
    );
  }
}
