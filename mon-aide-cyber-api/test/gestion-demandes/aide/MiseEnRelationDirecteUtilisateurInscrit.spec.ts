import { describe, expect, it } from 'vitest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { unUtilisateurInscrit } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { unUtilisateurMAC } from '../../constructeurs/constructeurUtilisateurMac';
import { gironde } from '../../../src/gestion-demandes/departements';
import crypto from 'crypto';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { MiseEnRelationDirecteUtilisateurInscrit } from '../../../src/gestion-demandes/aide/MiseEnRelationDirecteUtilisateurInscrit';
import { entitesPubliques } from '../../../src/espace-aidant/Aidant';

describe('Mise en relation directe avec un Utilisateur Inscrit', () => {
  it('N’envoie pas de email au COT', async () => {
    const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    const entrepots = new EntrepotsMemoire();
    const utilisateurInscrit = unUtilisateurInscrit()
      .avecUnEmail('jean.dupont@email.com')
      .construis();
    await entrepots.utilisateursInscrits().persiste(utilisateurInscrit);
    const miseEnRelation = new MiseEnRelationDirecteUtilisateurInscrit(
      adaptateurEnvoiMail,
      unUtilisateurMAC()
        .depuisUnUtilisateurInscrit(utilisateurInscrit)
        .construis()
    );

    await miseEnRelation.execute({
      demandeAide: {
        email: 'user@example.com',
        departement: gironde,
        identifiant: crypto.randomUUID(),
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        siret: '12345',
      },
      secteursActivite: [{ nom: 'Administration' }],
      typeEntite: entitesPubliques,
      siret: '12345',
    });

    expect(
      adaptateurEnvoiMail.aEteEnvoyeA(
        'cot@email.com',
        'Bonjour une entité a fait une demande d’aide'
      )
    ).toBe(false);
  });
});
