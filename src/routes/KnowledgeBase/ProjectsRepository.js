import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Form, Card, Select, List, Button, Icon, Badge, Input, Tabs } from 'antd';

import TagSelect from 'components/TagSelect';
import AvatarList from 'components/AvatarList';
import Ellipsis from 'components/Ellipsis';
import StandardFormRow from 'components/StandardFormRow';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import KnowledgeViewModal from './select/KnowledgeViewModal';
import styles from './ProjectsRepository.less';

const { TabPane } = Tabs;
const { Option } = Select;
const FormItem = Form.Item;

/* eslint react/no-array-index-key: 0 */
@Form.create()
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
export default class ProjectsRepository extends PureComponent {
  state = {
    KnowledgeViewVisible: false,
  }
  componentDidMount() {
    this.fetchMore();
  }

  handleFormSubmit = () => {
    const { form, dispatch } = this.props;
    // setTimeout 用于保证获取表单值是在所有表单字段更新完毕的时候
    setTimeout(() => {
      form.validateFields(err => {
        if (!err) {
          // eslint-disable-next-line
          dispatch({
            type: 'list/fetch',
            payload: {
              count: 8,
            },
          });
        }
      });
    }, 0);
  };

  handleKnowledgeViewVisible=(flag) =>{
    this.setState({
      KnowledgeViewVisible: !!flag,
    });
  };

  fetchMore = () => {
    this.props.dispatch({
      type: 'list/appendFetch',
      payload: {
        count: 5,
      },
    });
  };

  render() {
    const { list: { list }, loading, form } = this.props;
    const { getFieldDecorator } = form;
    const { KnowledgeViewVisible } = this.state;
    const loadMore =
      list.length > 0 ? (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
            {loading ? (
              <span>
                <Icon type="loading" /> 加载中...
              </span>
            ) : (
              '加载更多'
            )}
          </Button>
        </div>
      ) : null;

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    const cardList = list ? (
      <List
        rowKey="id"
        loading={list.length === 0 ? loading : false}
        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
        dataSource={list}
        loadMore={loadMore}
        renderItem={item => (
          <List.Item>
            <Card
              className={styles.card}
              hoverable
              cover={
                <img alt={item.title} src={item.cover} height={154} />
              }
              actions={[
                <IconText type="star-o" text={item.star} />,
                <IconText type="like-o" text={item.like} />,
                <IconText type="message" text={item.message} />,
              ]}
            >
              <Card.Meta
                title={
                  <a onClick={() => this.handleKnowledgeViewVisible(true)}>{item.title}</a>
                }
                description={
                  <Ellipsis lines={2}>{item.subDescription}</Ellipsis>
                }
              />
              <div className={styles.cardItemContent}>
                <span>{moment(item.updatedAt).fromNow()}</span>
                <div className={styles.avatarList}>
                  <AvatarList size="mini">
                    {item.members.map((member, i) => (
                      <AvatarList.Item
                        key={`${item.id}-avatar-${i}`}
                        src={member.avatar}
                        tips={member.name}
                      />
                    ))}
                  </AvatarList>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    ) : null;

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const KnowledgeViewMethods = {
      handleKnowledgeViewVisible: this.handleKnowledgeViewVisible,
    };

    return (
      <PageHeaderLayout>
        <Card>
          <Tabs defaultActiveKey="1" >
            <TabPane tab="所有文档" key="1">
              <div className={styles.coverCardList}>
                <Card bordered={false}>
                  <Form layout="inline">
                    <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
                      <FormItem>
                        {getFieldDecorator('category')(
                          <TagSelect onChange={this.handleFormSubmit} expandable>
                            <TagSelect.Option value="cat1">招标</TagSelect.Option>
                            <TagSelect.Option value="cat2">审计</TagSelect.Option>
                            <TagSelect.Option value="cat3">工程</TagSelect.Option>
                            <TagSelect.Option value="cat4">类目四</TagSelect.Option>
                            <TagSelect.Option value="cat5">类目五</TagSelect.Option>
                            <TagSelect.Option value="cat6">类目六</TagSelect.Option>
                            <TagSelect.Option value="cat7">类目七</TagSelect.Option>
                            <TagSelect.Option value="cat8">类目八</TagSelect.Option>
                            <TagSelect.Option value="cat9">类目九</TagSelect.Option>
                            <TagSelect.Option value="cat10">类目十</TagSelect.Option>
                            <TagSelect.Option value="cat11">类目十一</TagSelect.Option>
                            <TagSelect.Option value="cat12">类目十二</TagSelect.Option>
                          </TagSelect>
                        )}
                      </FormItem>
                    </StandardFormRow>
                    <StandardFormRow title="好评度" block style={{ paddingBottom: 11 }}>
                      <FormItem>
                        {getFieldDecorator('rate')(
                          <TagSelect onChange={this.handleFormSubmit} >
                            <TagSelect.Option value="cat1">优秀</TagSelect.Option>
                            <TagSelect.Option value="cat2">普通</TagSelect.Option>
                          </TagSelect>
                        )}
                      </FormItem>
                    </StandardFormRow>
                    <StandardFormRow title="其它选项" grid last>
                      <Row gutter={16}>
                        <Col lg={8} md={10} sm={10} xs={24}>
                          <FormItem {...formItemLayout} label="作者">
                            {getFieldDecorator('author', {})(
                              <Select
                                onChange={this.handleFormSubmit}
                                placeholder="不限"
                                style={{ maxWidth: 200, width: '100%' }}
                              >
                                <Option value="lisa">王昭君</Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col lg={8} md={10} sm={10} xs={24}>
                          <FormItem {...formItemLayout} label="标题">
                            {getFieldDecorator('title', {})(
                              <Input
                                onChange={this.handleFormSubmit}
                                placeholder="标题名称"
                                style={{ maxWidth: 200, width: '100%' }}
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </StandardFormRow>
                  </Form>
                </Card>
                <div className={styles.cardList}>{cardList}</div>
                <KnowledgeViewModal {...KnowledgeViewMethods} KnowledgeViewVisible={KnowledgeViewVisible} />
              </div>
            </TabPane>
            <TabPane tab="知识管理体系" key="2">
              <div className={styles.coverCardList}>
                <Card bordered={false}>
                  <Form layout="inline">
                    <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
                      <FormItem>
                        {getFieldDecorator('category')(
                          <TagSelect onChange={this.handleFormSubmit} expandable>
                            <TagSelect.Option value="cat1">招标</TagSelect.Option>
                            <TagSelect.Option value="cat2">审计</TagSelect.Option>
                            <TagSelect.Option value="cat3">工程</TagSelect.Option>
                            <TagSelect.Option value="cat4">类目四</TagSelect.Option>
                            <TagSelect.Option value="cat5">类目五</TagSelect.Option>
                            <TagSelect.Option value="cat6">类目六</TagSelect.Option>
                            <TagSelect.Option value="cat7">类目七</TagSelect.Option>
                            <TagSelect.Option value="cat8">类目八</TagSelect.Option>
                            <TagSelect.Option value="cat9">类目九</TagSelect.Option>
                            <TagSelect.Option value="cat10">类目十</TagSelect.Option>
                            <TagSelect.Option value="cat11">类目十一</TagSelect.Option>
                            <TagSelect.Option value="cat12">类目十二</TagSelect.Option>
                          </TagSelect>
                        )}
                      </FormItem>
                    </StandardFormRow>
                    <StandardFormRow title="好评度" block style={{ paddingBottom: 11 }}>
                      <FormItem>
                        {getFieldDecorator('rate')(
                          <TagSelect onChange={this.handleFormSubmit} >
                            <TagSelect.Option value="cat1">优秀</TagSelect.Option>
                            <TagSelect.Option value="cat2">普通</TagSelect.Option>
                          </TagSelect>
                        )}
                      </FormItem>
                    </StandardFormRow>
                    <StandardFormRow title="其它选项" grid last>
                      <Row gutter={16}>
                        <Col lg={8} md={10} sm={10} xs={24}>
                          <FormItem {...formItemLayout} label="作者">
                            {getFieldDecorator('author', {})(
                              <Select
                                onChange={this.handleFormSubmit}
                                placeholder="不限"
                                style={{ maxWidth: 200, width: '100%' }}
                              >
                                <Option value="lisa">王昭君</Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col lg={8} md={10} sm={10} xs={24}>
                          <FormItem {...formItemLayout} label="标题">
                            {getFieldDecorator('title', {})(
                              <Input
                                onChange={this.handleFormSubmit}
                                placeholder="标题名称"
                                style={{ maxWidth: 200, width: '100%' }}
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </StandardFormRow>
                  </Form>
                </Card>
                <div className={styles.cardList}>{cardList}</div>
              </div>
            </TabPane>
            <TabPane tab="公司文化" key="3">
              <div className={styles.coverCardList}>
                <Card bordered={false}>
                  <Form layout="inline">
                    <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
                      <FormItem>
                        {getFieldDecorator('category')(
                          <TagSelect onChange={this.handleFormSubmit} expandable>
                            <TagSelect.Option value="cat1">招标</TagSelect.Option>
                            <TagSelect.Option value="cat2">审计</TagSelect.Option>
                            <TagSelect.Option value="cat3">工程</TagSelect.Option>
                            <TagSelect.Option value="cat4">类目四</TagSelect.Option>
                            <TagSelect.Option value="cat5">类目五</TagSelect.Option>
                            <TagSelect.Option value="cat6">类目六</TagSelect.Option>
                            <TagSelect.Option value="cat7">类目七</TagSelect.Option>
                            <TagSelect.Option value="cat8">类目八</TagSelect.Option>
                            <TagSelect.Option value="cat9">类目九</TagSelect.Option>
                            <TagSelect.Option value="cat10">类目十</TagSelect.Option>
                            <TagSelect.Option value="cat11">类目十一</TagSelect.Option>
                            <TagSelect.Option value="cat12">类目十二</TagSelect.Option>
                          </TagSelect>
                        )}
                      </FormItem>
                    </StandardFormRow>
                    <StandardFormRow title="好评度" block style={{ paddingBottom: 11 }}>
                      <FormItem>
                        {getFieldDecorator('rate')(
                          <TagSelect onChange={this.handleFormSubmit} >
                            <TagSelect.Option value="cat1">优秀</TagSelect.Option>
                            <TagSelect.Option value="cat2">普通</TagSelect.Option>
                          </TagSelect>
                        )}
                      </FormItem>
                    </StandardFormRow>
                    <StandardFormRow title="其它选项" grid last>
                      <Row gutter={16}>
                        <Col lg={8} md={10} sm={10} xs={24}>
                          <FormItem {...formItemLayout} label="作者">
                            {getFieldDecorator('author', {})(
                              <Select
                                onChange={this.handleFormSubmit}
                                placeholder="不限"
                                style={{ maxWidth: 200, width: '100%' }}
                              >
                                <Option value="lisa">王昭君</Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col lg={8} md={10} sm={10} xs={24}>
                          <FormItem {...formItemLayout} label="标题">
                            {getFieldDecorator('title', {})(
                              <Input
                                onChange={this.handleFormSubmit}
                                placeholder="标题名称"
                                style={{ maxWidth: 200, width: '100%' }}
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </StandardFormRow>
                  </Form>
                </Card>
                <div className={styles.cardList}>{cardList}</div>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
