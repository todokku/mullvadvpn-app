import * as React from 'react';

interface IProps {
  children?: React.ReactNode;
}

export default class ModalContent extends React.Component<IProps> {
  public render() {
    return (
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        {this.props.children}
      </div>
    );
  }
}
