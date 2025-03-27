'use client';
import React, { createContext, useContext, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, XCircle, AlertTriangle, Info } from "lucide-react";

// Types of alerts possible
type AlertType = "success" | "error" | "warning" | "info" | "default";

// Alert structure
interface Alert {
  id: number;
  message: string;
  type: AlertType;
}

// Alert Context Props
interface AlertContextProps {
  alerts: Alert[];
  addAlert: (message: string, type?: AlertType) => void;
  removeAlert: (id: number) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Add alert
  const addAlert = (message: string, type: AlertType = "info") => {
    const newAlert: Alert = {
      id: Date.now(),
      message,
      type,
    };

    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

    // Automatically remove after 5 seconds
    setTimeout(() => removeAlert(newAlert.id), 5000);
  };

  // Remove alert
  const removeAlert = (id: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
      <AlertContainer alerts={alerts} removeAlert={removeAlert} />
    </AlertContext.Provider>
  );
};

// Hook to easily use alerts
export const useAlert = (): AlertContextProps => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

// Alert Container Component
const AlertContainer: React.FC<{ alerts: Alert[]; removeAlert: (id: number) => void }> = ({ 
  alerts, 
  removeAlert 
}) => {
  // Icons for different alert types
  const alertIcons = {
    success: <Check className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-orange-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    default: <Info className="h-5 w-5 text-gray-500" />
  };

  // Variant mapping for shadcn/ui Alert component
  const variantMap = {
    success: "default",
    error: "destructive",
    warning: "default",
    info: "default",
    default: "default"
  };

  return (
    <div 
      className="fixed bottom-4 right-4 space-y-3 z-50 max-w-xs"
      style={{ bottom: "1%", right: "1%" }}
    >
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={variantMap[alert.type] as any}
          className="flex items-center shadow-lg p-4 rounded-lg"
        >
          {alertIcons[alert.type]}
          <div className="ml-3 flex-grow">
            <AlertTitle>{alert.message}</AlertTitle>
          </div>
          <button
            onClick={() => removeAlert(alert.id)}
            className="ml-4 text-gray-500 hover:text-gray-700"
            aria-label="Close alert"
          >
            ✖
          </button>
        </Alert>
      ))}
    </div>
  );
};

export default AlertProvider;