import { ReactElement } from 'react';

enum TypeActionAuthentification {
  SAISIE_INVALIDEE = 'SAISIE_INVALIDEE',
  MOT_DE_PASSE_SAISI = 'MOT_DE_PASSE_SAISI',
  IDENTIFIANT_SAISI = 'IDENTIFIANT_SAISI',
  AUTHENTIFICATION_INVALIDEE = 'AUTHENTIFICATION_INVALIDEE',
}

type ClasseErreurInputGroup = 'fr-input-group--error';

type EtatAuthentification = {
  identifiant: string;
  motDePasse: string;
  champsErreur: ReactElement;
  saisieValide: () => boolean;
  erreur?: {
    identifiant?: {
      texteExplicatif: ReactElement;
      className: ClasseErreurInputGroup;
    };
    motDePasse?: {
      texteExplicatif: ReactElement;
      className: ClasseErreurInputGroup;
    };
  };
};

type ActionAuthentification =
  | {
      type: TypeActionAuthentification.SAISIE_INVALIDEE;
    }
  | {
      motDePasse: string;
      type: TypeActionAuthentification.MOT_DE_PASSE_SAISI;
    }
  | {
      identifiant: string;
      type: TypeActionAuthentification.IDENTIFIANT_SAISI;
    }
  | {
      erreur: Error;
      type: TypeActionAuthentification.AUTHENTIFICATION_INVALIDEE;
    };

const construisErreur = (
  clef: 'identifiant' | 'motDePasse',
  texteExplicatif: { identifiantTexteExplicatif: string; texte: string },
) => {
  return {
    [clef]: {
      texteExplicatif: (
        <TexteExplicatif
          id={texteExplicatif.identifiantTexteExplicatif}
          texte={texteExplicatif.texte}
        />
      ),
      className: 'fr-input-group--error' as ClasseErreurInputGroup,
    },
  };
};

const construisErreurIdentifiant = () => {
  return construisErreur('identifiant', {
    identifiantTexteExplicatif: 'identifiant-connexion',
    texte: 'Veuillez saisir votre identifiant de connexion.',
  });
};

const construisErreurMotDePasse = () => {
  return construisErreur('motDePasse', {
    identifiantTexteExplicatif: 'mot-de-passe',
    texte: 'Veuillez saisir votre mot de passe.',
  });
};

export const reducteurAuthentification = (
  etat: EtatAuthentification,
  action: ActionAuthentification,
): EtatAuthentification => {
  switch (action.type) {
    case TypeActionAuthentification.AUTHENTIFICATION_INVALIDEE: {
      return {
        ...etat,
        champsErreur: <ChampsErreur erreur={action.erreur} />,
        erreur: {
          ...construisErreurIdentifiant(),
          ...construisErreurMotDePasse(),
        },
      };
    }
    case TypeActionAuthentification.IDENTIFIANT_SAISI: {
      let erreur = etat.erreur?.motDePasse
        ? {
            ...(etat.erreur?.motDePasse
              ? { motDePasse: { ...etat.erreur.motDePasse } }
              : undefined),
          }
        : undefined;
      if (action.identifiant.length === 0) {
        erreur = { ...erreur, ...construisErreurIdentifiant() };
      }
      return {
        ...etat,
        identifiant: action.identifiant,
        saisieValide: () =>
          etat.motDePasse.length > 0 && action.identifiant.length > 0,
        erreur,
      };
    }
    case TypeActionAuthentification.MOT_DE_PASSE_SAISI: {
      let erreur = etat.erreur?.identifiant
        ? {
            ...(etat.erreur?.identifiant
              ? { identifiant: { ...etat.erreur.identifiant } }
              : undefined),
          }
        : undefined;
      if (action.motDePasse.length === 0) {
        erreur = { ...erreur, ...construisErreurMotDePasse() };
      }
      return {
        ...etat,
        motDePasse: action.motDePasse,
        saisieValide: () =>
          etat.identifiant.length > 0 && action.motDePasse.length > 0,
        erreur,
      };
    }

    case TypeActionAuthentification.SAISIE_INVALIDEE:
      return {
        ...etat,
        erreur: {
          ...(etat.identifiant.length === 0 && construisErreurIdentifiant()),
          ...(etat.motDePasse.length === 0 && construisErreurMotDePasse()),
        },
      };
  }
};

export const motDePasseSaisi = (motDePasse: string): ActionAuthentification => {
  return {
    motDePasse,
    type: TypeActionAuthentification.MOT_DE_PASSE_SAISI,
  };
};

export const identifiantSaisi = (
  identifiant: string,
): ActionAuthentification => {
  return {
    identifiant,
    type: TypeActionAuthentification.IDENTIFIANT_SAISI,
  };
};

export const saisieInvalidee = (): ActionAuthentification => {
  return { type: TypeActionAuthentification.SAISIE_INVALIDEE };
};

export const authentificationInvalidee = (
  erreur: Error,
): ActionAuthentification => {
  return {
    erreur,
    type: TypeActionAuthentification.AUTHENTIFICATION_INVALIDEE,
  };
};

export const initialiseReducteur = (): EtatAuthentification => {
  return {
    champsErreur: <></>,
    identifiant: '',
    motDePasse: '',
    saisieValide: (): boolean => false,
  };
};

type ProprietesTexteExplicatif = {
  id: string;
  texte: string;
};
export const TexteExplicatif = (proprietes: ProprietesTexteExplicatif) => {
  return (
    <p id={proprietes.id} className="fr-error-text">
      {proprietes.texte}
    </p>
  );
};

export const ChampsErreur = ({ erreur }: { erreur: Error }) => {
  return (
    <div className="fr-alert fr-alert--error fr-alert--sm">
      <p>{erreur.message}</p>
    </div>
  );
};
