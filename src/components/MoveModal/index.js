import  React from 'react';
import ModalTitle from './ModalTitle';
import Modal from "../../../node_modules/antd/lib/modal/Modal";

export  default  class SeniorModal extends  React.Component{
  render() {
    const title = <ModalTitle title={this.props.title} />;
    return (
      <Modal
        {...this.props}
        title={title}
      >
        {this.props.children}
      </Modal>
    );
  }
}
