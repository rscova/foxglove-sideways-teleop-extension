import { PanelExtensionContext, RenderState, Topic } from "@foxglove/studio";
import { useLayoutEffect, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Gamepad from 'react-gamepad'

var controller_status = "Err. No Xbox controller found";

var currentTopic = "robot/cmd_vel"

var message = {
  linear: {
    x: 0,
    y: 0,
    z: 0,
  },
  angular: {
    x: 0,
    y: 0,
    z: 0,
  },
};

function connectHandler() {
  controller_status = "Xbox controller connected!";
}

function disconnectHandler() {
  controller_status = "Xbox controller disconnected!";
}

function axisChangeHandler(axisName: string, value: number) {
  if (axisName == "LeftStickY") {
    message.linear.x = value;
  } else if (axisName == "RightStickX") {
    message.angular.z = value;
  }
}

function SidewaysTeleopPanel({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [_topics, setTopics] = useState<readonly Topic[] | undefined>();

  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

  useLayoutEffect(() => {
    context.onRender = (renderState: RenderState, done) => {
      setRenderDone(() => done);
      setTopics(renderState.topics);
    };
    context.watch("currentFrame");
    
    context.advertise?.(currentTopic, "geometry_msgs/Twist");

  }, []);

  // invoke the done callback once the render is complete
  useEffect(() => {
    if (controller_status == "Xbox controller connected!") {
      context.publish?.(currentTopic, message);
    }

    renderDone?.();
  }, [renderDone]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Teleoperation Panel</h1>
      <p>Status: {controller_status}</p>
      <p>Topic:  {currentTopic} </p>
      <div>
          <p>Linear command: {message.linear.x}</p>
          <p>Angular command: {message.angular.z}</p>
      </div>
      <div className="gamepad">
        <span>
          <Gamepad
            onConnect={connectHandler}
            onDisconnect={disconnectHandler}
            onAxisChange={axisChangeHandler}
          >
            <main>
              <p></p>
            </main>
          </Gamepad>
        </span>
      </div>
    </div>
  );
}

export function initSidewaysTeleopPanel(context: PanelExtensionContext) {
  ReactDOM.render(<SidewaysTeleopPanel context={context} />, context.panelElement);
}
