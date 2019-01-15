import * as React from 'react';
import { Component, Styles, View } from 'reactxp';

interface IProps {
  alertId: string;
  presentation: 'alert' | 'actionsheet';
}

const baseStyle = Styles.createViewStyle({
  flexDirection: 'column',
  flex: -1,
  backgroundColor: 'rgb(25, 46, 69)',
});

const alertStyle = Styles.createViewStyle({
  padding: 14,
  margin: 10,
  borderRadius: 11,
});

const actionSheetStyle = Styles.createViewStyle({
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderTopLeftRadius: 11,
  borderTopRightRadius: 11,
});

export default class ModalAlert extends Component<IProps> {
  public static defaultProps: Partial<IProps> = {
    presentation: 'alert',
  };

  public render() {
    return (
      <View
        style={[baseStyle, this.props.presentation === 'alert' ? alertStyle : actionSheetStyle]}>
        {this.props.children}
      </View>
    );
  }
}
