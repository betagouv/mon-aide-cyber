import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import './toaster.scss';
import { Toast } from '../../composants/communs/messages/Toast';

export interface Toast {
  type: 'SUCCES' | 'ERREUR' | 'ATTENTION' | 'INFO';
  message: string;
  duree?: number;
  affiche: boolean;
}

interface ContexteToastType {
  toast: Toast | undefined;
  afficheToast: (toats: Toast) => void;
}

const ContexteToast = createContext<ContexteToastType | undefined>(undefined);

export const FournisseurDeToast = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | undefined>(undefined);

  const afficheToast = useCallback((toast: Toast) => {
    const leToast: Toast = {
      duree: 5000,
      ...toast,
    };

    setToast(leToast);

    setTimeout(() => setToast(undefined), leToast.duree);
    setTimeout(
      () =>
        setToast((prev) => (prev ? { ...prev, affiche: false } : undefined)),
      Number(leToast.duree) - 1000
    );
  }, []);

  return (
    <ContexteToast.Provider value={{ toast: toast, afficheToast }}>
      {children}
      <ToastContainer />
    </ContexteToast.Provider>
  );
};

interface Toaster {
  success: (message: string, options?: Partial<Toast>) => void;
}

export const useToast = (): Toaster => {
  const context = useContext(ContexteToast);
  if (!context) {
    throw new Error('useToast doit être utilisé via un FournisseurDeToast');
  }

  const { afficheToast } = context;

  return {
    success: (message: string, options?: Partial<Toast>) =>
      afficheToast({ type: 'SUCCES', message, affiche: true, ...options }),
  };
};

export const ToastContainer = () => {
  const { toast } = useContext(ContexteToast)!;

  return (
    <div className="toaster">
      <div className="pointer-events-auto">
        {toast ? (
          <Toast
            id="toast"
            message={toast.message}
            affiche={toast.affiche}
            type={toast.type}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
