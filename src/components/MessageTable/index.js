import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

// 初始化选中了那些Row ， column.needTotal对应Table中column的其中一次参数needTotal，如果是True，则把这列数据遍历进数组，并返回
function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);// 通过这个function返回需要加权的Row

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  componentWillReceiveProps(nextProps) {
    // clean state
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let needTotalList = [...this.state.needTotalList];
    needTotalList = needTotalList.map(item => {
      return {
        ...item,
        total: selectedRows.reduce((sum, val) => {
          return sum + parseFloat(val[item.dataIndex], 10);
        }, 0),
      };
    });

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  //
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };



  // 展示了总记录数
   showTotal = (total) =>{
    return `总计 ${total} 条记录 `;
  };


  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data: { list, pagination,total }, loading, columns, rowKey,scroll, onRow, rowClassName } = this.props;
    const paginationProps = {
      showTotal: this.showTotal ,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions:['10','20','30','40','50'],
      total: total,
      ...pagination,
    };

    return (
      <div className={styles.standardTable}>
        <Table
          scroll={scroll}
          loading={loading}
          rowKey={rowKey || 'key'}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          onRow={onRow}
          rowClassName={rowClassName}
        />
      </div>
    );
  }
}

export default StandardTable;
