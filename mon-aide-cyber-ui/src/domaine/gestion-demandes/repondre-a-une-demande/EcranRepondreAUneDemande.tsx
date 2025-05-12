import './ecran-repondre-a-une-demande.scss';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Departement } from '../departement.ts';
import { RepondreALaDemande } from './composants/RepondreALaDemande.tsx';
import { ConfirmationReponseALaDemande } from './composants/ConfirmationReponseALaDemande.tsx';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { DemandeDejaPourvue } from './composants/DemandeDejaPourvue.tsx';

export type DemandeAide = {
  dateCreation: string;
  departement: Departement;
  typeEntite: string;
  secteurActivite: string;
};
const recupereDemandeAide = (): DemandeAide => ({
  dateCreation: '29/03/1996 17:30',
  departement: {
    code: '33',
    nom: 'Gironde',
  },
  typeEntite: 'Entreprise privée',
  secteurActivite: 'Tertiaire',
});

type ProprietesEcransAvecToken = {
  token?: string;
};

export const EcranRepondreAUneDemande = ({
  token,
}: ProprietesEcransAvecToken) => {
  const macAPI = useMACAPI();

  const { data: demandeAide } = useQuery({
    enabled: !!token,
    queryKey: ['recuperer-demande-aide', token],
    queryFn: () => recupereDemandeAide(),
  });

  const { mutate, isSuccess, isError } = useMutation({
    mutationKey: ['repondre-a-une-demande'],
    mutationFn: async (token: string) => {
      return await macAPI.execute<any, any, { token: string }>(
        constructeurParametresAPI<{ token: string }>()
          .url('/api/aidant/repondre-a-une-demande')
          .methode('POST')
          .corps({
            token,
          })
          .construis(),
        (reponse) => reponse
      );
    },
  });

  const repondreALaDemande = () => {
    if (token) mutate(token);
  };

  if (isSuccess) {
    return (
      <main role="main" className="ecran-repondre-a-une-demande">
        <ConfirmationReponseALaDemande />
      </main>
    );
  }

  if (isError) {
    return (
      <main role="main" className="ecran-repondre-a-une-demande">
        <DemandeDejaPourvue />
      </main>
    );
  }

  return (
    <main role="main" className="ecran-repondre-a-une-demande">
      <RepondreALaDemande
        demandeAide={demandeAide!}
        surReponsePositive={repondreALaDemande}
      />
    </main>
  );
};
