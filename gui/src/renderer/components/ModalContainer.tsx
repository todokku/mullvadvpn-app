import * as React from 'react';
import ModalAlert from './ModalAlert';
import ModalTransitionContainer from './ModalTransitionContainer';

type ModalAlertProps = ModalAlert['props'];
type ChildElement = React.ReactElement<ModalAlertProps> | undefined;

interface IProps {
  children?: ChildElement | ChildElement[];
}

export default class ModalContainer extends React.Component<IProps> {
  public render() {
    const alerts: Array<React.ReactElement<ModalAlertProps>> = [];
    const contents: React.ReactChild[] = [];

    React.Children.forEach(this.props.children, (child) => {
      if (child && typeof child === 'object' && child.props.alertId) {
        alerts.push(child);
      } else {
        contents.push(child);
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
