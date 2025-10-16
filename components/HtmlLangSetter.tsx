"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n-client";

// Sets the <html lang> attribute on the client after hydration
// to match the active locale from I18n context.
export function HtmlLangSetter() {
  const { locale } = useI18n();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}

