import { Entrepots } from '../../../domaine/Entrepots';
import { AdaptateurEnvoiMail } from '../../../adaptateurs/AdaptateurEnvoiMail';
import { fabriqueEntrepots } from '../../../adaptateurs/fabriqueEntrepots';
import { fabriqueAdaptateurEnvoiMail } from '../../../infrastructure/adaptateurs/fabriqueAdaptateurEnvoiMail';
import { RechercheDemandeAideComplete } from '../../../gestion-demandes/aide/DemandeAide';
import { MiseEnRelationParCriteres } from '../../../gestion-demandes/aide/MiseEnRelationParCriteres';
import {
  AdaptateurRechercheEntreprise,
  adaptateurRechercheEntreprise,
  Entreprise,
} from '../../../infrastructure/adaptateurs/adaptateurRechercheEntreprise';
import { AdaptateurDeRequeteHTTP } from '../../../infrastructure/adaptateurs/adaptateurDeRequeteHTTP';
import {
  AdaptateurGeographie,
  unAdaptateurGeographie,
} from '../../../adaptateurs/AdaptateurGeographie';
import { fabriqueAnnuaireCOT } from '../../../infrastructure/adaptateurs/fabriqueAnnuaireCOT';
import { Departement } from '../../../gestion-demandes/departements';

export const executeMiseEnRelation = async (
  mailEntite: string,
  configuration: {
    entrepots: Entrepots;
    adaptateurEnvoiMail: AdaptateurEnvoiMail;
    adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
    adaptateurGeographie: AdaptateurGeographie;
    annuaireCot: {
      rechercheEmailParDepartement: (departement: Departement) => string;
    };
  } = {
    entrepots: fabriqueEntrepots(),
    adaptateurEnvoiMail: fabriqueAdaptateurEnvoiMail(),
    adaptateurRechercheEntreprise: adaptateurRechercheEntreprise(
      new AdaptateurDeRequeteHTTP()
    ),
    adaptateurGeographie: unAdaptateurGeographie(),
    annuaireCot: fabriqueAnnuaireCOT().annuaireCOT(),
  }
) => {
  const demandeAide: RechercheDemandeAideComplete =
    (await configuration.entrepots
      .demandesAides()
      .rechercheParEmail(mailEntite)) as RechercheDemandeAideComplete;

  const entreprise =
    (await configuration.adaptateurRechercheEntreprise.rechercheParSiret(
      demandeAide.demandeAide.siret
    )) as Entreprise;

  await new MiseEnRelationParCriteres(
    configuration.adaptateurEnvoiMail,
    configuration.annuaireCot,
    configuration.entrepots,
    configuration.adaptateurRechercheEntreprise,
    configuration.adaptateurGeographie
  ).execute({
    demandeAide: {
      siret: demandeAide.demandeAide.siret,
      identifiant: demandeAide.demandeAide.identifiant,
      email: demandeAide.demandeAide.email,
      departement: demandeAide.demandeAide.departement,
      dateSignatureCGU: demandeAide.demandeAide.dateSignatureCGU,
      ...(demandeAide.demandeAide.raisonSociale && {
        raisonSociale: demandeAide.demandeAide.raisonSociale,
      }),
    },
    siret: demandeAide.demandeAide.siret,
    typeEntite: entreprise.typeEntite,
    secteursActivite: entreprise.secteursActivite,
  });
};
