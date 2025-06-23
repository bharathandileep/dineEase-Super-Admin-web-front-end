import React, { ReactNode } from "react";
import SimpleBar from "simplebar-react";
import classNames from "classnames";

interface MessageListProps {
  className?: string;
  children?: ReactNode;
}

/**
 * MessageList
 */
const MessageList = ({ className, children }: MessageListProps) => {
  return (
    <SimpleBar style={{ maxHeight: "407px" }}>
      <div className={classNames("inbox-widget", className)}>
        {children}
      </div>
    </SimpleBar>
  );
};

export default MessageList;