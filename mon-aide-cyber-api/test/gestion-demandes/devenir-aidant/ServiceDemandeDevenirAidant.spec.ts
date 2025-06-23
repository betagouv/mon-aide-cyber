import { describe, expect, it } from 'vitest';
import {
  DemandesDevenirAidant,
  unServiceDemandesDevenirAidant,
} from '../../../src/gestion-demandes/devenir-aidant/ServiceDemandeDevenirAidant';
import { EntrepotDemandeDevenirAidantMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { uneDemandeDevenirAidant } from '../../constructeurs/constructeurDemandesDevenirAidant';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { DemandeDevenirAidant } from '../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';

describe('Service demande devenir Aidant', () => {
  it('Retourne les demandes en attente', async () => {
    const { entite, ...premiereDemande } =
      uneDemandeDevenirAidant().construis();
    const entrepot = new EntrepotDemandeDevenirAidantMemoire();
    await entrepot.persiste(premiereDemande as DemandeDevenirAidant);
    await entrepot.persiste(uneDemandeDevenirAidant().traitee().construis());

    const demandes =
      await unServiceDemandesDevenirAidant(entrepot).demandesEnCours();

    expect(demandes).toStrictEqual<DemandesDevenirAidant>([
      {
        nom: premiereDemande.nom,
        prenom: premiereDemande.prenom,
        email: premiereDemande.mail,
        dateDemande: FournisseurHorloge.formateDate(premiereDemande.date).date,
        departement: premiereDemande.departement.nom,
      },
    ]);
  });
});
