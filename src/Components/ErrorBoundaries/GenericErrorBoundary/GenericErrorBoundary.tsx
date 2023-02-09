import React, { ErrorInfo, ReactNode } from "react";

import type { NCComponent } from "Types/UI/Components";

export interface GenericErrorBoundaryProps extends NCComponent {
  children: ReactNode
}

interface GenericErrorBoundaryState {
  hasError: boolean
}

class GenericErrorBoundary extends React.Component<GenericErrorBoundaryProps, GenericErrorBoundaryState> {
  state: GenericErrorBoundaryState;

  constructor(props: GenericErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`${Error.name}: ${errorInfo.componentStack}`)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="GenericErrorBoundaryContainer">
          <h1 color="error">React Component Error</h1>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GenericErrorBoundary;
