import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Table } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './PartnerScope.less';
import StandardTable from '../../../components/StandardTable/index';

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
// PureComponent优化Component的性能
export default class PartnerScope extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  render() {
    const columns = [
      {
        title: '合伙人名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '合伙人性质',
        dataIndex: 'age',
        key: 'age',
        width: '12%',
      },
      {
        title: '分管范围',
        dataIndex: 'address',
        width: '30%',
        key: 'address',
      },
      {
        title: '分管部门',
        dataIndex: 'address',
        width: '30%',
        key: 'address',
      },
    ];

    const data = [
      {
        key: 1,
        name: '陈所',
        age: '执行合伙人',
        address: '牵头制定执业质量标准....',
        children: [
          {
            key: 42,
            name: '楼所',
            age: '管理合伙人',
            address: '日常',
          },
          {
            key: 12,
            name: '冯所',
            age: '技术合伙人',
            address: '代理记账',
            children: [
              {
                key: 121,
                name: '黄总',
                age: '技术合伙人',
                address: '日常',
              },
            ],
          },
          {
            key: 13,
            name: '陈',
            age: '技术合伙人',
            address: '业务拓展管理',
            children: [
              {
                key: 131,
                name: '楼',
                age: '合伙人',
                address: '质量检查',
                children: [
                  {
                    key: 1311,
                    name: '吴',
                    age: '合伙人',
                    address: '竣工决策',
                  },
                  {
                    key: 1312,
                    name: '庄',
                    age: '合伙人',
                    address: '审计工作',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        key: 2,
        name: '孙所',
        age: '执行合伙人',
        address: '经营管理平台',
      },
    ];

    // rowSelection objects indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              bordered={true}
              columns={columns}
              rowSelection={rowSelection}
              dataSource={data}
            />,
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
