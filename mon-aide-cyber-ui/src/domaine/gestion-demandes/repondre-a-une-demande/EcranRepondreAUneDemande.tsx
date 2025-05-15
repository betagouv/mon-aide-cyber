import './ecran-repondre-a-une-demande.scss';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Departement } from '../departement.ts';
import { RepondreALaDemande } from './composants/RepondreALaDemande.tsx';
import { ConfirmationReponseALaDemande } from './composants/ConfirmationReponseALaDemande.tsx';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { DemandeDejaPourvue } from './composants/DemandeDejaPourvue.tsx';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';

type ProprietesEcransAvecToken = {
  token?: string;
};

export type DemandePourPostuler = {
  dateCreation: string;
  departement: Departement;
  typeEntite: string;
  secteurActivite: string;
};

export const EcranRepondreAUneDemande = ({
  token,
}: ProprietesEcransAvecToken) => {
  const macAPI = useMACAPI();
  const navigationMAC = useNavigationMAC();

  const { data: demandeAide, isError: tokenIllegal } =
    useQuery<DemandePourPostuler>({
      enabled: !!token,
      queryKey: ['recuperer-demande-aide', token],
      retry: false,
      queryFn: async () =>
        await macAPI.execute<DemandePourPostuler, DemandePourPostuler>(
          constructeurParametresAPI()
            .url(
              `/api/aidant/repondre-a-une-demande/informations-de-demande?token=${token}`
            )
            .methode('GET')
            .construis(),
          async (json) => await json
        ),
    });

  const postulerALaDemande = useMutation({
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

  if (tokenIllegal) {
    navigationMAC.navigue('/', navigationMAC.etat);
  }

  if (postulerALaDemande.isSuccess) {
    return (
      <main role="main" className="ecran-repondre-a-une-demande">
        <ConfirmationReponseALaDemande />
      </main>
    );
  }

  if (postulerALaDemande.isError) {
    return (
      <main role="main" className="ecran-repondre-a-une-demande">
        <DemandeDejaPourvue />
      </main>
    );
  }

  return (
    <main role="main" className="ecran-repondre-a-une-demande">
      <RepondreALaDemande
        demandeAide={demandeAide}
        surReponse={() => {
          if (token) postulerALaDemande.mutate(token);
        }}
      />
    </main>
  );
};
