import { useEffect, useState } from "react";

import { defaultContent, getSiteContent, type ContentState } from "@/lib/admin-data";

export function useSiteContent() {
  const [content, setContent] = useState<ContentState>(defaultContent);

  useEffect(() => {
    let mounted = true;
    getSiteContent()
      .then((loadedContent) => {
        if (mounted) setContent(loadedContent);
      })
      .catch(() => {
        if (mounted) setContent(defaultContent);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return content;
}
