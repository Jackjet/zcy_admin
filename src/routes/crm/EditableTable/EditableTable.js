import React, { PureComponent } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import EditableCell from './EditableCell';

class EditableTable extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '业务员',
        dataIndex: 'name',
        width: '30%',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'name')} />
        ),
      },
      {
        title: '电话',
        dataIndex: 'phone',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'phone')} />
        ),
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        render: (text, record) => (
          <EditableCell value={text} onChange={this.onCellChange(record.key, 'remarks')} />
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return this.state.dataSource.length > 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
              <a href=" ">Delete</a>
            </Popconfirm>
          ) : null;
        },
      },
    ];

    this.state = {
      dataSource: [
        {
          key: '0',
          name: '汪工',
          phone: '123456',
          remarks: 'aaa',
        },
        {
          key: '1',
          name: '申工',
          phone: '456789',
          remarks: 'bbb',
        },
      ],
      count: 2,
    };
  }
  onCellChange = (key, dataIndex) => {
    return value => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource });
      }
    };
  };
  onDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `小杨 ${count}`,
      phone: 18,
      remarks: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          设置业务员
        </Button>
        <Table bordered dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}

export default EditableTable;
