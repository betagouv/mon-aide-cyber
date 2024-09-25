export type ProprietesToast = {
  message: string;
  type: 'SUCCES' | 'ERREUR' | 'ATTENTION' | 'INFO';
};

export const Toast = ({ message, type }: ProprietesToast) => {
  if (!type) return null;

  switch (type) {
    case 'SUCCES': {
      return (
        <div className="mac-callout succes">
          <div>
            <i className="fr-icon-success-fill " aria-hidden="true"></i>
          </div>
          <div>{message}</div>
        </div>
      );
    }
    case 'ERREUR': {
      return (
        <div className="mac-callout erreur">
          <div>
            <i className="fr-icon-close-circle-fill" aria-hidden="true"></i>
          </div>

          <div>{message}</div>
        </div>
      );
    }
    case 'ATTENTION': {
      return (
        <div className="mac-callout attention">
          <div>
            <i className="fr-icon-error-warning-fill" aria-hidden="true"></i>
          </div>

          <div>{message}</div>
        </div>
      );
    }
    case 'INFO': {
      return (
        <div className="mac-callout information">
          <div>
            <i className="fr-icon-information-fill " aria-hidden="true"></i>
          </div>

          <div>{message}</div>
        </div>
      );
    }
  }
};
