import React, { PureComponent } from 'react';
import { Input, Icon } from 'antd';
import styles from './index.less';

class EditableCell extends PureComponent {
  state = {
    value: this.props.value,
    editable: false,
  };
  handleChange = e => {
    const { value } = e.target;
    this.setState({ value });
  };
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  };
  edit = () => {
    this.setState({ editable: true });
  };
  render() {
    const { value, editable } = this.state;
    return (
      <div className={styles['editable-cell']}>
        {editable ? (
          <Input
            value={value}
            onChange={this.handleChange}
            onPressEnter={this.check}
            suffix={
              <Icon
                type="check"
                className={styles['editable-cell-icon-check']}
                onClick={this.check}
              />
            }
          />
        ) : (
          <div style={{ paddingRight: 24 }}>
            {value || ' '}
            <Icon type="edit" className={styles['editable-cell-icon']} onClick={this.edit} />
          </div>
        )}
      </div>
    );
  }
}

export default EditableCell;
