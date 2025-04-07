"use client";

import { usealert } from "@/hooks/use-alert";
import {
  alert,
  alertClose,
  alertDescription,
  alertProvider,
  alertTitle,
  alertViewport,
} from "@/components/ui/alert";

export function alerter() {
  const { alerts } = usealert();

  return (
    <alertProvider>
      {alerts.map(({ id, title, description, action, ...props }) => (
        <alert key={id} {...props}>
          <div className="grid gap-1">
            {title && <alertTitle>{title}</alertTitle>}
            {description && <alertDescription>{description}</alertDescription>}
          </div>
          {action}
          <alertClose />
        </alert>
      ))}
      <alertViewport />
    </alertProvider>
  );
}
