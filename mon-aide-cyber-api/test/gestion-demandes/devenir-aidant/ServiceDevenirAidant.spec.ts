import { describe, expect, it } from 'vitest';
import { unConstructeurDeDemandeDevenirAidant } from './constructeurDeDemandeDevenirAidant';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import {
  DemandeDTO,
  ServiceDevenirAidant,
} from '../../../src/gestion-demandes/devenir-aidant/ServiceDevenirAidant';

describe('Service devenir Aidant', () => {
  it('Permet de récupérer la demande', async () => {
    const demandePersistee = unConstructeurDeDemandeDevenirAidant().construis();
    const entrepot = new EntrepotsMemoire().demandesDevenirAidant();
    await entrepot.persiste(demandePersistee);

    const demandeCherchee = await new ServiceDevenirAidant(
      entrepot
    ).rechercheParMail(demandePersistee.mail);

    expect(demandeCherchee).toStrictEqual<DemandeDTO>({
      identifiant: demandePersistee.identifiant,
      date: demandePersistee.date,
      nom: demandePersistee.nom,
      prenom: demandePersistee.prenom,
      mail: demandePersistee.mail,
      departement: demandePersistee.departement,
    });
  });
});
