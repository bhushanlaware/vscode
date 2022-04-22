import * as React from "react";

type InjectIframeProps = {
  iframe: HTMLIFrameElement
}

export class InjectIframe extends React.Component<InjectIframeProps> {
  rootRef: React.RefObject<HTMLDivElement>;

  constructor(props: InjectIframeProps) {
    super(props);
    this.rootRef = React.createRef();
  }

  componentDidMount() {
    this.rootRef.current?.appendChild(this.props.iframe);
  }

  render() {
    return <div ref={this.rootRef} className="injected-iframe-container"/>
  }
}
