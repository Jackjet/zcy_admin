import React, { PureComponent } from 'react';
import {
  Tabs,
  Slider,
  Row,
  Col,
  InputNumber,
} from 'antd';

const marks = {
  0: '0°C',
  15: '阶段1',
  26: '阶段2',
  37: '阶段3',
  56:'阶段4',
  87:'阶段5',
  100: {
    style: {
      color: '#f50',
    },
    label: <strong>100°C</strong>,
  },
};

class TabsDemo extends PureComponent {

  state = {
    inputValue: 0,
  };

  onChange = (value) => {
    if (isNaN(value)) {
      return;
    }
    this.setState({
      inputValue: value,
    });
  };

  render() {
    const { inputValue } = this.state;
    return (
      <div>
        <Row>
          <Col span={12}>
            <Slider
              min={0}
              max={1}
              onChange={this.onChange}
              value={typeof inputValue === 'number' ? inputValue : 0}
              step={0.01}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              min={0}
              max={1}
              style={{ marginLeft: 16 }}
              step={0.01}
              value={inputValue}
              onChange={this.onChange}
            />
          </Col>
        </Row>
        <Slider marks={marks} defaultValue={37} />
        <Slider marks={marks} step={null} defaultValue={37} />
      </div>
    );
  }
}
export default TabsDemo;
