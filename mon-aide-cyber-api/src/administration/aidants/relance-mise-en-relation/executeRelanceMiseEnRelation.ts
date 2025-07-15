import { AdaptateurRelationsMAC } from '../../../relation/AdaptateurRelationsMAC';
import { Entrepots } from '../../../domaine/Entrepots';
import { RechercheDemandeAideComplete } from '../../../gestion-demandes/aide/DemandeAide';
import { fabriqueEntrepots } from '../../../adaptateurs/fabriqueEntrepots';
import { BusEvenement, Evenement } from '../../../domaine/BusEvenement';
import { BusEvenementMAC } from '../../../infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from '../../../adaptateurs/fabriqueConsommateursEvenements';
import crypto from 'crypto';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';
import { AdaptateurEnvoiMail } from '../../../adaptateurs/AdaptateurEnvoiMail';
import { fabriqueAdaptateurEnvoiMail } from '../../../infrastructure/adaptateurs/fabriqueAdaptateurEnvoiMail';
import { MiseEnRelationParCriteres } from '../../../gestion-demandes/aide/MiseEnRelationParCriteres';
import {
  adaptateurRechercheEntreprise,
  AdaptateurRechercheEntreprise,
  Entreprise,
} from '../../../infrastructure/adaptateurs/adaptateurRechercheEntreprise';
import {
  AdaptateurGeographie,
  unAdaptateurGeographie,
} from '../../../adaptateurs/AdaptateurGeographie';
import { Departement } from '../../../gestion-demandes/departements';
import { AdaptateurDeRequeteHTTP } from '../../../infrastructure/adaptateurs/adaptateurDeRequeteHTTP';
import { fabriqueAnnuaireCOT } from '../../../infrastructure/adaptateurs/fabriqueAnnuaireCOT';

export const executeRelanceMiseEnRelation = async (
  emailAide: string,
  configuration: {
    entrepots: Entrepots;
    adaptateurRelation: AdaptateurRelationsMAC;
    busEvenement: BusEvenement;
    adaptateurMail: AdaptateurEnvoiMail;
    adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
    adaptateurGeographie: AdaptateurGeographie;
    annuaireCot: {
      rechercheEmailParDepartement: (departement: Departement) => string;
    };
  } = {
    entrepots: fabriqueEntrepots(),
    adaptateurRelation: new AdaptateurRelationsMAC(),
    busEvenement: new BusEvenementMAC(
      fabriqueConsommateursEvenements(new AdaptateurRelationsMAC())
    ),
    adaptateurMail: fabriqueAdaptateurEnvoiMail(),
    adaptateurRechercheEntreprise: adaptateurRechercheEntreprise(
      new AdaptateurDeRequeteHTTP()
    ),
    adaptateurGeographie: unAdaptateurGeographie(),
    annuaireCot: fabriqueAnnuaireCOT().annuaireCOT(),
  }
) => {
  const demandeAide = (await configuration.entrepots
    .demandesAides()
    .rechercheParEmail(emailAide)) as RechercheDemandeAideComplete;

  const demandeAttribuee =
    await configuration.adaptateurRelation.demandeAttribuee(
      demandeAide.demandeAide.identifiant
    );

  await configuration.adaptateurRelation.retireLesRelations([
    {
      relation: 'demandeAttribuee',
      utilisateur: {
        type: 'aidant',
        identifiant: demandeAttribuee.utilisateur.identifiant,
      },
      objet: {
        type: 'demandeAide',
        identifiant: demandeAide.demandeAide.identifiant,
      },
    },
  ]);

  await configuration.busEvenement.publie<AffectationAnnulee>({
    identifiant: crypto.randomUUID(),
    type: 'AFFECTATION_ANNULEE',
    date: FournisseurHorloge.maintenant(),
    corps: {
      identifiantDemande: demandeAide.demandeAide.identifiant,
      identifiantAidant: demandeAttribuee.utilisateur.identifiant,
    },
  });

  const entreprise =
    (await configuration.adaptateurRechercheEntreprise.rechercheParSiret(
      demandeAide.demandeAide.siret
    )) as Entreprise;

  await new MiseEnRelationParCriteres(
    configuration.adaptateurMail,
    configuration.annuaireCot,
    configuration.entrepots,
    configuration.adaptateurGeographie
  ).execute({
    demandeAide: demandeAide.demandeAide,
    siret: demandeAide.demandeAide.siret,
    secteursActivite: entreprise.secteursActivite,
    typeEntite: entreprise.typeEntite,
    codeEPCI: entreprise.codeEpci,
  });
};
export type AffectationAnnulee = Evenement<{
  identifiantDemande: string;
  identifiantAidant: string;
}>;
