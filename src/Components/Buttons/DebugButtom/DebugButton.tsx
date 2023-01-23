import type { NCComponent } from "OldTypes/UI/Components";

export interface DebugButtonProps extends NCComponent {
  click?: () => void;
}

function DebugButton({click} : DebugButtonProps) {

  return (
    <button onClick={click}>Debug Button&#8482;</button>
  )
}

export default DebugButton;
