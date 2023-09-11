const enum XboxControllerButton {
  A,
  B,
  X,
  Y,
  LeftBumper,
  RightBumper,
  LeftTrigger,
  RightTrigger,
  Select,
  Start,
  L3,
  R3,
  DpadUp,
  DpadDown,
  DpadLeft,
  DpadRight,
}

class Controls {
  isUp = false;
  isDown = false;
  isLeft = false;
  isRight = false;
  isConfirm = false;
  isEscape = false;
  isJump = false;
  inputDirection: DOMPoint;

  keyMap: Map<string, boolean> = new Map();
  previousState = { isUp: this.isUp, isDown: this.isDown, isConfirm: this.isConfirm, 
    isEscape: this.isEscape, isJump: this.isJump, isLeft: this.isLeft, isRight: this.isRight };

  constructor() {
    document.addEventListener('keydown', event => this.toggleKey(event, true));
    document.addEventListener('keyup', event => this.toggleKey(event, false));
    this.inputDirection = new DOMPoint();
  }

  queryController() {
    this.previousState.isUp = this.isUp;
    this.previousState.isDown = this.isDown;
    this.previousState.isConfirm = this.isConfirm;
    this.previousState.isEscape = this.isEscape;
    this.previousState.isJump = this.isJump;
    this.previousState.isLeft = this.isLeft;
    this.previousState.isRight = this.isRight;
    
    const gamepad = navigator.getGamepads()[1];
    const isButtonPressed = (button: XboxControllerButton) => gamepad?.buttons[button].pressed;

    const leftVal = (this.keyMap.get('KeyA') || this.keyMap.get('ArrowLeft') || isButtonPressed(XboxControllerButton.DpadLeft)) ? -1 : 0;
    const rightVal = (this.keyMap.get('KeyD') || this.keyMap.get('ArrowRight') || isButtonPressed(XboxControllerButton.DpadRight)) ? 1 : 0;
    const upVal = (this.keyMap.get('KeyW') || this.keyMap.get('ArrowUp') || isButtonPressed(XboxControllerButton.DpadUp)) ? -1 : 0;
    const downVal = (this.keyMap.get('KeyS') || this.keyMap.get('ArrowDown') || isButtonPressed(XboxControllerButton.DpadDown)) ? 1 : 0;
    this.inputDirection.x = (leftVal + rightVal) || gamepad?.axes[0] || 0;
    this.inputDirection.y = (upVal + downVal) || gamepad?.axes[1] || 0;

    const deadzone = 0.1;
    if (Math.hypot(this.inputDirection.x, this.inputDirection.y) < deadzone) {
      this.inputDirection.x = 0;
      this.inputDirection.y = 0;
    }

    this.isUp = this.inputDirection.y < 0;
    this.isDown = this.inputDirection.y > 0;
    this.isLeft = this.inputDirection.x < 0;
    this.isRight = this.inputDirection.x > 0;
    this.isConfirm = Boolean(this.keyMap.get('Enter') || isButtonPressed(XboxControllerButton.Start) || isButtonPressed(XboxControllerButton.Start));
    this.isEscape = Boolean(this.keyMap.get('Escape') || isButtonPressed(XboxControllerButton.Select));
    this.isJump = Boolean(this.keyMap.get('Space') || isButtonPressed(XboxControllerButton.A));

    // window.addEventListener("gamepadconnected", (e) => {
    //   alert('xbox')
    //   console.log(
    //     "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    //     e.gamepad.index,
    //     e.gamepad.id,
    //     e.gamepad.buttons.length,
    //     e.gamepad.axes.length,
    //   );
    // });
  }

  private toggleKey(event: KeyboardEvent, isPressed: boolean) {
    this.keyMap.set(event.code, isPressed);
  }
}

export const controls = new Controls();
