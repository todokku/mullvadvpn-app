import * as React from 'react';
import { Animated, Styles, Types, UserInterface, View } from 'reactxp';

import ModalAlert from './ModalAlert';
import ModalBackdrop from './ModalBackdrop';

type ModalAlertProps = ModalAlert['props'];

interface IProps {
  children?: React.ReactElement<ModalAlertProps>;
}

interface IState {
  activeChild?: React.ReactElement<ModalAlertProps>;
  nextActiveChild?: React.ReactElement<ModalAlertProps>;
}

const baseStyle = Styles.createViewStyle({
  position: 'absolute',
  flexDirection: 'column',
  flex: 0,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

const measuringViewStyle = Styles.createViewStyle({
  flex: 0,
  flexDirection: 'column',
});

const alertStyle = Styles.createViewStyle({
  justifyContent: 'center',
});

const actionSheetStyle = Styles.createViewStyle({
  justifyContent: 'flex-end',
});

export default class ModalTransitionContainer extends React.Component<IProps, IState> {
  public state: IState = {};

  private opacityValue = Animated.createValue(0);
  private translateValue = Animated.createValue(0);

  private alertAnimationStyle = Styles.createAnimatedViewStyle({
    opacity: this.opacityValue,
  });

  private actionSheetAnimationStyle = Styles.createAnimatedViewStyle({
    transform: [
      {
        translateY: this.translateValue,
      },
    ],
  });

  private animation?: Types.Animated.CompositeAnimation;
  private cycling = false;

  private measuringViewRef = React.createRef<View>();

  constructor(props: IProps) {
    super(props);

    const child = props.children;

    if (child && typeof child === 'object' && child.props.alertId) {
      this.state = {
        ...this.state,
        nextActiveChild: React.cloneElement(child as React.ReactElement<ModalAlertProps>),
      };
    }
  }

  public componentDidMount() {
    this.cycle();
  }

  public componentDidUpdate(_oldProps: IProps, _oldState: IState) {
    this.cycle();
  }

  public UNSAFE_componentWillReceiveProps(props: IProps) {
    const candidate = props.children;

    if (this.state.activeChild && !candidate) {
      // the existing child is being removed
      this.setState({
        nextActiveChild: undefined,
      });
    } else if (!this.state.activeChild && candidate) {
      // the new child is being added
      this.setState({
        nextActiveChild: candidate,
      });
    } else if (
      this.state.activeChild &&
      candidate &&
      this.state.activeChild.props.alertId !== candidate.props.alertId
    ) {
      // the existing child is being replaced
      this.setState({
        nextActiveChild: candidate,
      });
    }
  }

  public componentWillUnmount() {
    if (this.animation) {
      this.animation.stop();
    }
  }

  public render() {
    const showBackdrop = React.Children.count(this.props.children) > 0;
    const presentationStyle =
      this.state.activeChild && this.state.activeChild.props.presentation === 'alert'
        ? [alertStyle, this.alertAnimationStyle]
        : [actionSheetStyle, this.actionSheetAnimationStyle];

    // return null when there is nothing to show to make sure we don't block the pointer events to
    // the underlying views
    return this.state.activeChild || this.state.nextActiveChild ? (
      <React.Fragment>
        <ModalBackdrop visible={showBackdrop} />
        <Animated.View style={[baseStyle, presentationStyle]}>
          <View style={measuringViewStyle} ref={this.measuringViewRef}>
            {this.state.activeChild}
          </View>
        </Animated.View>
      </React.Fragment>
    ) : null;
  }

  private cycle() {
    if (!this.cycling) {
      this.cycling = true;

      this.cycleUnguarded(() => {
        this.cycling = false;
      });
    }
  }

  private cycleUnguarded(done: () => void) {
    const transitionNextChild = () => {
      this.mountNextChild(() => {
        if (this.state.activeChild) {
          this.animateActiveChild(true, () => {
            // cycle again if the new child was added during the animation
            if (this.state.nextActiveChild) {
              this.cycleUnguarded(done);
            } else {
              done();
            }
          });
        } else {
          done();
        }
      });
    };

    if (this.state.activeChild) {
      // transition out the active child if any
      this.animateActiveChild(false, () => {
        transitionNextChild();
      });
    } else if (this.state.nextActiveChild) {
      // transition in the next child if any
      transitionNextChild();
    } else {
      // nothing to do
      done();
    }
  }

  private animateActiveChild(transitionIn: boolean, finished: Types.Animated.EndCallback) {
    const presentation = this.state.activeChild!.props.presentation;

    switch (presentation) {
      case 'alert':
        this.animateAlertPresentation(transitionIn, finished);
        break;

      case 'actionsheet':
        this.animateActionSheetPresentation(transitionIn, finished);
        break;
    }
  }

  private mountNextChild(finished: () => void) {
    this.setState(
      (state) => ({
        activeChild: state.nextActiveChild,
        nextActiveChild: undefined,
      }),
      finished,
    );
  }

  private animateAlertPresentation(transitionIn: boolean, finished: Types.Animated.EndCallback) {
    const animation = this.createAlertAnimation(transitionIn ? 1 : 0);

    if (transitionIn) {
      this.opacityValue.setValue(0);
    }

    animation.start(finished);
  }

  private async animateActionSheetPresentation(
    transitionIn: boolean,
    finished: Types.Animated.EndCallback,
  ) {
    const layout = await UserInterface.measureLayoutRelativeToWindow(
      this.measuringViewRef.current!,
    );
    const animation = this.createActionSheetAnimation(transitionIn ? 0 : layout.height);

    if (transitionIn) {
      this.translateValue.setValue(layout.height);
    }

    animation.start(finished);
  }

  private createAlertAnimation(opacity: number) {
    return Animated.timing(this.opacityValue, {
      toValue: opacity,
      easing: Animated.Easing.InOut(),
      duration: 250.0,
      useNativeDriver: true,
    });
  }

  private createActionSheetAnimation(translateY: number) {
    return Animated.timing(this.translateValue, {
      toValue: translateY,
      easing: Animated.Easing.InOut(),
      duration: 300.0,
      useNativeDriver: true,
    });
  }
}
