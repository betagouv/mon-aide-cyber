import { ExpressValidator, Meta } from 'express-validator';
import { Entrepots } from '../../domaine/Entrepots';

type MessagesErreursValidateurMotDePasse = {
  ancienMotDePasseObligatoire: string;
  differentDeAncienMotDePasse: string;
  correspondAuMotDePasseUtilisateur: string;
  laConfirmationDuMotDePasseCorrespond?: string;
};

const validateurDeMotDePasse = (
  entrepots: Entrepots,
  messageValidateurs: MessagesErreursValidateurMotDePasse
) =>
  new ExpressValidator({
    ancienMotDePasseDifferentDuNouveauMotDePasse: (
      value: string,
      { req }: Meta
    ) => value !== req.body.motDePasse,
    confirmationMotDePasseCorrespond: (value: string, { req }: Meta) =>
      value === req.body.motDePasse,
    motDePasseUtilisateur: async (value: string, { req }: Meta) => {
      const aidant = await entrepots
        .aidants()
        .lis(req.identifiantUtilisateurCourant);
      if (aidant.motDePasse !== value) {
        throw new Error(messageValidateurs.correspondAuMotDePasseUtilisateur);
      }
      return true;
    },
  });

const validateursDeMotDePasse = (
  entrepots: Entrepots,
  nouveauMotDePasse: string,
  ancienMotDePasse: string,
  messageValidateurs: MessagesErreursValidateurMotDePasse,
  confirmationNouveauMotDePasse?: string
) => {
  const { body } = validateurDeMotDePasse(entrepots, messageValidateurs);
  const validateurs = [
    body(nouveauMotDePasse)
      .isStrongPassword({
        minLength: 16,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.'
      ),
    body(ancienMotDePasse)
      .notEmpty()
      .withMessage(messageValidateurs.ancienMotDePasseObligatoire)
      .ancienMotDePasseDifferentDuNouveauMotDePasse()
      .withMessage(messageValidateurs.differentDeAncienMotDePasse)
      .motDePasseUtilisateur(),
  ];
  if (confirmationNouveauMotDePasse) {
    validateurs.push(
      body(confirmationNouveauMotDePasse)
        .confirmationMotDePasseCorrespond()
        .withMessage(messageValidateurs.laConfirmationDuMotDePasseCorrespond!)
    );
  }
  return validateurs;
};

export const validateursDeMotDePasseTemporaire = (
  entrepots: Entrepots,
  nouveauMotDePasse: string,
  motDePasseTemporaire: string
) => {
  return validateursDeMotDePasse(
    entrepots,
    nouveauMotDePasse,
    motDePasseTemporaire,
    {
      ancienMotDePasseObligatoire:
        'Le mot de passe temporaire est obligatoire.',
      differentDeAncienMotDePasse:
        'Votre nouveau mot de passe doit être différent du mot de passe temporaire.',
      correspondAuMotDePasseUtilisateur:
        'Votre mot de passe temporaire est erroné.',
    }
  );
};

export const validateurDeNouveauMotDePasse = (
  entrepots: Entrepots,
  ancienMotDepasse: string,
  nouveauMotDePasse: string,
  confirmationNouveauMotDePasse: string
) => {
  return validateursDeMotDePasse(
    entrepots,
    nouveauMotDePasse,
    ancienMotDepasse,
    {
      ancienMotDePasseObligatoire: "L'ancien mot de passe est obligatoire.",
      differentDeAncienMotDePasse:
        'Votre nouveau mot de passe doit être différent de votre ancien mot de passe.',
      correspondAuMotDePasseUtilisateur:
        'Votre ancien mot de passe est erroné.',
      laConfirmationDuMotDePasseCorrespond:
        'La confirmation de votre mot de passe ne correspond pas.',
    },
    confirmationNouveauMotDePasse
  );
};

export class ErreurValidationMotDePasse extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}
