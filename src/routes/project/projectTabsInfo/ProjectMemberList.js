import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Divider, TreeSelect, Transfer } from 'antd';

const mockData = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 3 < 1,
  });
}

const targetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);
const { TreeNode } = TreeSelect;

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class ProjectMemberList extends PureComponent {
  state = {
    expandForm: false,
    value: undefined,
    targetKeys,
    selectedKeys: [],
    openKeys: ['sub1'],
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }
  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  onChange = value => {
    this.setState({ value });
  };

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });

    console.log('targetKeys: ', targetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });

    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  };

  handleScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const state = this.state;

    return (
      <div>
        <Row>
          <Col span={6}>
            <Divider type="vertical" />
          </Col>
          <Col span={6}>
            <TreeSelect
              showSearch
              style={{ width: 300 }}
              value={this.state.value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              allowClear
              treeDefaultExpandAll
              onChange={this.onChange}
            >
              <TreeNode value="parent 1" title="parent 1" key="0-1">
                <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
                  <TreeNode value="leaf1" title="my leaf" key="random" />
                  <TreeNode value="leaf2" title="your leaf" key="random1" />
                </TreeNode>
                <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
                  <TreeNode
                    value="sss"
                    title={<b style={{ color: '#08c' }}>sss</b>}
                    key="random3"
                  />
                </TreeNode>
              </TreeNode>
            </TreeSelect>
          </Col>
          <Divider type="vertical" />\
          <Col span={12}>
            <Transfer
              dataSource={mockData}
              targetKeys={state.targetKeys}
              selectedKeys={state.selectedKeys}
              onChange={this.handleChange}
              onSelectChange={this.handleSelectChange}
              onScroll={this.handleScroll}
              render={item => item.title}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
