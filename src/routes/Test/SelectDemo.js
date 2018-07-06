import React, { PureComponent } from 'react';

import {
  Select,
} from 'antd';

const { Option } = Select;
const provinceData = ['浙江', '江苏'];
const cityData = {
  浙江: ['杭州', '宁波', '温州'],
  江苏: ['南京', '苏州', '镇江'],
};
export default class SelectDemo extends PureComponent {
  state = {
    cities: cityData[provinceData[0]],
    secondCity: cityData[provinceData[0]][0],
  };
  onSecondCityChange(value) {
    SelectDemo.setState({
      secondCity: value,
    });
  };
  handleProvinceChange(value) {
    SelectDemo.setState({
      cities: cityData[value],
      secondCity: cityData[value][0],
    });
  };


  render() {
    const provinceOptions = provinceData.map(province => <Option key={province}>{province}</Option>);
    const cityOptions = this.state.cities.map(city => <Option key={city}>{city}</Option>);
    return (
      <div>
        <Select defaultValue={provinceData[0]} style={{ width: 90 }} onChange={this.handleProvinceChange}>
          {provinceOptions}
        </Select>
        <Select value={this.state.secondCity} style={{ width: 90 }} onChange={this.onSecondCityChange}>
          {cityOptions}
        </Select>
      </div>
    );
  }
}
