import { beforeEach, describe, expect, it } from 'vitest';
import { unAidant } from '../../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import {
  Departement,
  finistere,
} from '../../../../src/gestion-demandes/departements';
import { entitesPubliques } from '../../../../src/espace-aidant/Aidant';
import { AidantMisEnRelation } from '../../../../src/gestion-demandes/aide/MiseEnRelationParCriteres';
import { uneDemandeAide } from '../../../gestion-demandes/aide/ConstructeurDemandeAide';
import { AdaptateurEnvoiMailMemoire } from '../../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { EntrepotsMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { executeMiseEnRelation } from '../../../../src/administration/aidants/mise-en-relation/executeMiseEnRelation';
import { unAdaptateurRechercheEntreprise } from '../../../constructeurs/constructeurAdaptateurRechercheEntrepriseEnDur';
import { AdaptateurGeographie } from '../../../../src/adaptateurs/AdaptateurGeographie';

describe('Commande pour exécuter la mise en relation', () => {
  let envoieMail: AdaptateurEnvoiMailMemoire;
  let entrepots: EntrepotsMemoire;
  let adaptateurGeo: AdaptateurGeographie;
  const annuaireCot = {
    rechercheEmailParDepartement: (__departement: Departement) =>
      'cot@par-defaut.fr',
  };

  beforeEach(() => {
    envoieMail = new AdaptateurEnvoiMailMemoire();
    entrepots = new EntrepotsMemoire();
    adaptateurGeo = {
      epciAvecCode: async (__codeEpci: string) => ({ nom: '' }),
    };
  });

  it('Envoie un mail aux Aidants qui matchent', async () => {
    const adaptateurRechercheEntreprise = unAdaptateurRechercheEntreprise()
      .quiRenvoieCodeEpci('1223')
      .dansLeServicePublic()
      .dansLesTransports()
      .avecLeSiret('1234567890')
      .construis();
    adaptateurGeo.epciAvecCode = async (__codeEpci: string) => ({
      nom: 'Plouguerneau',
    });
    const aidantsContactes: AidantMisEnRelation[] = [];
    envoieMail.envoiToutesLesMisesEnRelation = async (
      aidants: AidantMisEnRelation[],
      __donneesMiseEnRelation
    ) => {
      aidantsContactes.push(...aidants);
    };
    const premierAidant = unAidant()
      .avecUnEmail('aidant-qui-matche@mail.con')
      .avecUnNomPrenom('Jean DUPONT')
      .ayantPourDepartements([finistere])
      .ayantPourSecteursActivite([{ nom: 'Transports' }])
      .ayantPourTypesEntite([entitesPubliques])
      .construis();
    await entrepots.aidants().persiste(premierAidant);
    const demandeAide = uneDemandeAide()
      .avecUnEmail('beta@beta.gouv.fr')
      .avecLeSiret('1234567890')
      .dansLeDepartement(finistere)
      .construis();
    await entrepots.demandesAides().persiste(demandeAide);

    await executeMiseEnRelation(demandeAide.email, {
      entrepots,
      adaptateurEnvoiMail: envoieMail,
      adaptateurRechercheEntreprise,
      adaptateurGeographie: adaptateurGeo,
      annuaireCot,
    });

    expect(aidantsContactes).toHaveLength(1);
    expect(aidantsContactes[0].email).toBe('aidant-qui-matche@mail.con');
    expect(aidantsContactes[0].nomPrenom).toBe('Jean DUPONT');
  });
});
