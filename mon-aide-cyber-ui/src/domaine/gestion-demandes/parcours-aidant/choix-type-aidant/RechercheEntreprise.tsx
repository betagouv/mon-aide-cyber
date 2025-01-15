import { Entreprise } from '../Entreprise';
import { useMACAPI } from '../../../../fournisseurs/api/useMACAPI.ts';
import { useNavigationMAC } from '../../../../fournisseurs/hooks.ts';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MoteurDeLiens } from '../../../MoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { AutoCompletion } from '../../../../composants/auto-completion/AutoCompletion.tsx';

type EntrepriseAPI = {
  nom: string;
  siret: string;
  commune: string;
  departement: string;
};

type TypeEntreprise = 'servicePublic' | 'representantEtat' | 'association';

export const RechercheEntreprise = (props: {
  surChoixEntite: (entreprise: Entreprise) => void;
  type: TypeEntreprise;
  entrepriseSelectionnee: Entreprise | undefined | null;
}) => {
  const macAPI = useMACAPI();
  const navigationMAC = useNavigationMAC();
  const [saisie, setSaisie] = useState<string | undefined>(undefined);
  const [saisieDebounced, setSaisieDebounced] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setSaisieDebounced(saisie);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [saisie]);

  const criteresRecherche: Map<TypeEntreprise, string> = new Map([
    ['servicePublic', '&est_service_public=true'],
    ['representantEtat', '&est_service_public=true'],
    ['association', '&est_association=true'],
  ]);

  const { data: entrepriseTrouvees } = useQuery({
    enabled: !!saisieDebounced && saisieDebounced.length > 2,
    queryKey: ['recherche-entreprise', saisieDebounced],
    queryFn: () => {
      const rechercheEntreprise = new MoteurDeLiens(
        navigationMAC.etat
      ).trouveEtRenvoie('rechercher-entreprise');
      const url = `${rechercheEntreprise.url}?nom=${saisieDebounced}${criteresRecherche.get(props.type)}`;
      return macAPI.execute<Entreprise[], EntrepriseAPI[]>(
        constructeurParametresAPI()
          .url(url)
          .methode(rechercheEntreprise.methode!)
          .construis(),
        async (json) => {
          return await json;
        }
      );
    },
  });

  const estEntreprise = (
    entreprise: string | Entreprise
  ): entreprise is Entreprise => {
    const ent = entreprise as Entreprise;
    return (
      ent.nom !== undefined &&
      ent.commune !== undefined &&
      ent.siret !== undefined &&
      ent.departement !== undefined
    );
  };

  return (
    <>
      <p>Veuillez indiquer le nom de votre structure/employeur</p>
      <AutoCompletion<Entreprise>
        nom="entreprise"
        mappeur={(entreprise) => {
          const ent = entreprise as Entreprise;
          if (estEntreprise(entreprise)) {
            return `${ent.nom} - ${ent.commune} (${ent.departement}) - (${ent.siret})`;
          }
          return ent.nom;
        }}
        surSelection={(valeur) => props.surChoixEntite(valeur)}
        surSaisie={(saisie) => {
          if (estEntreprise(saisie)) {
            props.surChoixEntite(saisie);
          }
          setSaisie(saisie as string);
        }}
        valeurSaisie={
          props.entrepriseSelectionnee
            ? props.entrepriseSelectionnee
            : ({
                nom: saisie || '',
              } as Entreprise)
        }
        suggestionsInitiales={entrepriseTrouvees ? entrepriseTrouvees : []}
      />
    </>
  );
};
