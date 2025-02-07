import { describe, expect, it } from 'vitest';
import {
  DemandesDevenirAidant,
  unServiceDemandesDevenirAidant,
} from '../../../src/gestion-demandes/devenir-aidant/ServiceDemandeDevenirAidant';
import { EntrepotDemandeDevenirAidantMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { uneDemandeDevenirAidant } from '../../constructeurs/constructeurDemandesDevenirAidant';

describe('Service demande devenir Aidant', () => {
  it('Retourne les demandes en attente', async () => {
    const premiereDemande = uneDemandeDevenirAidant().construis();
    const entrepot = new EntrepotDemandeDevenirAidantMemoire();
    await entrepot.persiste(premiereDemande);
    await entrepot.persiste(uneDemandeDevenirAidant().traitee().construis());

    const demandes =
      await unServiceDemandesDevenirAidant(entrepot).demandesEnCours();

    expect(demandes).toStrictEqual<DemandesDevenirAidant>([
      {
        nom: premiereDemande.nom,
        prenom: premiereDemande.prenom,
        dateDemande: premiereDemande.date,
        departement: premiereDemande.departement,
      },
    ]);
  });
});
