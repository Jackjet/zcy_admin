import React, { PureComponent } from 'react';
import { Select } from 'antd';

const { Option } = Select;

export default class SelectDemo extends PureComponent {
  state = {
    options: [],
  }

  handleChange = () => {
      const optionData = ['贵宾', '重要客户', '一般客户', '潜在客户'].map((domain) => {
        const email = `${domain}`;
        return <Option key={email}>{email}</Option>;
      });
    this.setState({
      options: optionData,
    });
  }

  render() {
    // filterOption needs to be false，as the value is dynamically generated
    return (
      <Select
        mode="combobox"
        style={{ width: 200 }}
        onMouseEnter={this.handleChange}
        filterOption={false}
        placeholder="Enter the account name"
      >
        {this.state.options}
      </Select>
    );
  }
}

