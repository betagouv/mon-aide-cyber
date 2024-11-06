import { describe, expect } from 'vitest';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import {
  Aidant,
  ErreurCreationEspaceAidant,
} from '../../src/espace-aidant/Aidant';
import {
  AidantCree,
  CapteurCommandeCreeEspaceAidant,
  EspaceAidantCree,
} from '../../src/espace-aidant/CapteurCommandeCreeEspaceAidant';
import crypto from 'crypto';
import { unAidant } from '../constructeurs/constructeursAidantUtilisateur';

describe('Capteur de commande de création de compte Aidant', () => {
  it('Crée un compte Aidant', async () => {
    const entrepots = new EntrepotsMemoire();
    const dateSignatureCGU = new Date(Date.parse('2024-08-30T14:38:25'));

    const aidantCree = await new CapteurCommandeCreeEspaceAidant(
      entrepots,
      new BusEvenementDeTest()
    ).execute({
      identifiant: crypto.randomUUID(),
      dateSignatureCGU,
      email: 'jean.dupont@beta.fr',
      nomPrenom: 'Jean Dupont',
      motDePasse: 'toto12345',
      type: 'CommandeCreeEspaceAidant',
      departement: {
        nom: 'Alpes-de-Haute-Provence',
        code: '4',
        codeRegion: '93',
      },
    });

    const aidants = await entrepots.aidants().tous();
    expect(aidants).toHaveLength(1);
    expect(aidants[0]).toStrictEqual<Aidant>({
      identifiant: expect.any(String),
      email: 'jean.dupont@beta.fr',
      nomPrenom: 'Jean Dupont',
      preferences: {
        secteursActivite: [],
        departements: [
          {
            nom: 'Alpes-de-Haute-Provence',
            code: '4',
            codeRegion: '93',
          },
        ],
        typesEntites: [],
      },
      consentementAnnuaire: false,
    });
    expect(aidantCree).toStrictEqual<EspaceAidantCree>({
      identifiant: expect.any(String),
      email: 'jean.dupont@beta.fr',
      nomPrenom: 'Jean Dupont',
    });
  });

  it('Ne crée pas l’Aidant si un compte existe déjà avec le même email', async () => {
    const entrepots = new EntrepotsMemoire();
    const dateSignatureCGU = new Date(Date.parse('2024-08-30T14:38:25'));
    const aidant = unAidant().construis();
    entrepots.aidants().persiste(aidant);

    const compteAidantCree = new CapteurCommandeCreeEspaceAidant(
      entrepots,
      new BusEvenementDeTest()
    ).execute({
      identifiant: crypto.randomUUID(),
      dateSignatureCGU,
      email: aidant.email,
      nomPrenom: 'Jean Dupont',
      motDePasse: '',
      type: 'CommandeCreeEspaceAidant',
      departement: {
        nom: 'Ariège',
        code: '9',
        codeRegion: '76',
      },
    });

    const aidants = await entrepots.aidants().tous();
    expect(aidants).toHaveLength(1);
    await expect(compteAidantCree).rejects.toStrictEqual(
      new ErreurCreationEspaceAidant(
        'Un compte Aidant avec cette adresse email existe déjà.'
      )
    );
  });

  it('Publie l’événement "AIDANT_CREE"', async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const entrepots = new EntrepotsMemoire();
    const dateSignatureCGU = new Date(Date.parse('2024-08-30T14:38:25'));
    const busEvenement = new BusEvenementDeTest();

    const aidantCree = await new CapteurCommandeCreeEspaceAidant(
      entrepots,
      busEvenement
    ).execute({
      identifiant: crypto.randomUUID(),
      dateSignatureCGU,
      email: 'jean.dupont@beta.fr',
      nomPrenom: 'Jean Dupont',
      motDePasse: '',
      type: 'CommandeCreeEspaceAidant',
      departement: {
        nom: 'Guadeloupe',
        code: '971',
        codeRegion: '01',
      },
    });

    expect(busEvenement.evenementRecu).toStrictEqual<AidantCree>({
      identifiant: aidantCree.identifiant,
      type: 'AIDANT_CREE',
      date: FournisseurHorloge.maintenant(),
      corps: { identifiant: aidantCree.identifiant, departement: '971' },
    });
  });
});
