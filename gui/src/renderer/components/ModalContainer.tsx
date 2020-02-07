import * as React from 'react';
import ModalAlert from './ModalAlert';
import ModalTransitionContainer from './ModalTransitionContainer';

type ModalAlertProps = ModalAlert['props'];

interface IProps {
  children?: React.ReactNode;
}

export default class ModalContainer extends React.Component<IProps> {
  public render() {
    const alerts: Array<React.ReactElement<ModalAlertProps>> = [];
    const contents: React.ReactChild[] = [];

    React.Children.forEach(this.props.children, (child) => {
      const element = child as React.ReactElement<ModalAlertProps>;

      if (child && typeof child === 'object' && element.props.alertId) {
        alerts.push(element);
      } else {
        contents.push(element);
      }
    });

    const alert = alerts.length > 0 ? alerts[0] : undefined;
    if (alerts.length > 1) {
      throw new Error('ModalContainer does not support more than one ModalAlert at a time.');
    }

    return (
      <div style={{ position: 'relative', flex: 1 }}>
        {contents}

        <ModalTransitionContainer>{alert}</ModalTransitionContainer>
      </div>
    );
  }
}
