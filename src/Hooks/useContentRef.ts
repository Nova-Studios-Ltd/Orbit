import { useRef } from "react";

function useContentRef(content?: Uint8Array, contentUrl?: string) {
  const contentRef = useRef("");

  if (content) {
    contentRef.current = URL.createObjectURL(new Blob([content]));
  } else if (contentUrl) {
    contentRef.current = contentUrl;
  }

  return contentRef;
}

export default useContentRef;
