import { FormulaireReinitialiserMotDePasse } from './FormulaireReinitialiserMotDePasse.tsx';
import { useNavigationMAC } from '../../../../fournisseurs/hooks.ts';
import { useMACAPI } from '../../../../fournisseurs/api/useMACAPI.ts';
import { useRecupereContexteNavigation } from '../../../../hooks/useRecupereContexteNavigation.ts';
import { useMutation } from '@tanstack/react-query';
import { MoteurDeLiens } from '../../../MoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useNavigate } from 'react-router-dom';
import { Alerte } from '../../../../composants/communs/messages/Alerte.tsx';

export type CorpsReinitialiserMotDePasse = {
  token: string;
  motDePasse: string;
  confirmationMotDePasse: string;
};
export const CapteurFormulaireReinitialiserMotDePasse = ({
  token,
}: {
  token: string;
}) => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const navigate = useNavigate();

  useRecupereContexteNavigation(
    'reinitialisation-mot-de-passe:reinitialiser-mot-de-passe'
  );

  const { mutate, error, isError } = useMutation({
    mutationKey: ['changer-mot-de-passe'],
    mutationFn: ({
      motDePasse,
      confirmationMotDePasse,
    }: {
      motDePasse: string;
      confirmationMotDePasse: string;
    }) => {
      if (!token || token.length === 0 || token.trim() === '')
        throw new Error(
          'Une erreur est survenue lors de la demande de réinitialisation de mot de passe'
        );

      const actionSoumettre = new MoteurDeLiens(
        navigationMAC.etat
      ).trouveEtRenvoie('reinitialiser-mot-de-passe');

      if (!actionSoumettre)
        throw new Error(
          'Une erreur est survenue lors de la demande de réinitialisation de mot de passe'
        );

      return macAPI.execute<void, void, CorpsReinitialiserMotDePasse>(
        constructeurParametresAPI<CorpsReinitialiserMotDePasse>()
          .url(actionSoumettre.url)
          .methode(actionSoumettre.methode!)
          .corps({
            token: token,
            motDePasse: motDePasse,
            confirmationMotDePasse: confirmationMotDePasse,
          })
          .construis(),
        (corps) => corps
      );
    },
    onSuccess: () => {
      navigate('/connexion');
    },
  });

  return (
    <FormulaireReinitialiserMotDePasse surSoumission={mutate}>
      {isError ? <Alerte message={error.message} type="ERREUR" /> : null}
    </FormulaireReinitialiserMotDePasse>
  );
};
