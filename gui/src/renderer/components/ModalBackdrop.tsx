import * as React from 'react';
import { Animated, Component, Styles, Types } from 'reactxp';

const modalBackdropStyle = Styles.createViewStyle({
  backgroundColor: 'rgba(0,0,0,0.5)',
  position: 'absolute',
  flexDirection: 'column',
  flex: 1,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

interface IProps {
  visible: boolean;
}

export default class ModalBackdrop extends Component<IProps> {
  private opacityValue = Animated.createValue(0);
  private animation?: Types.Animated.CompositeAnimation = undefined;
  private animatedStyle = Styles.createAnimatedViewStyle({
    opacity: this.opacityValue,
  });

  public componentDidUpdate(oldProps: IProps) {
    if (this.props.visible !== oldProps.visible) {
      this.animate();
    }
  }

  public componentDidMount() {
    this.animate();
  }

  public componentWillUnmount() {
    if (this.animation) {
      this.animation.stop();
    }
  }

  public render() {
    return (
      <Animated.View style={[modalBackdropStyle, this.animatedStyle]}>
        {this.props.children}
      </Animated.View>
    );
  }

  private animate() {
    if (this.animation) {
      this.animation.stop();
    }

    this.animation = Animated.timing(this.opacityValue, {
      toValue: this.props.visible ? 1 : 0,
      easing: Animated.Easing.InOut(),
      duration: 250.0,
      useNativeDriver: true,
    });

    this.animation.start();
  }
}
