import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {
  AdaptateurProConnect,
  DemandeAutorisation,
  DemandeDeconnexion,
  InformationsUtilisateur,
  Jeton,
} from '../../../src/adaptateurs/pro-connect/adaptateurProConnect';
import { fakerFR } from '@faker-js/faker';

export class AdaptateurProConnectDeTest implements AdaptateurProConnect {
  private url = new URL(fakerFR.internet.url());
  private nonce = fakerFR.string.alphanumeric(10);
  private state = fakerFR.string.alphanumeric(10);
  genereDemandeAutorisation: () => Promise<DemandeAutorisation>;
  genereDemandeDeconnexion: (idToken: string) => Promise<DemandeDeconnexion>;
  recupereInformationsUtilisateur: (
    accessToken: string
  ) => Promise<InformationsUtilisateur>;
  recupereJeton: (
    requete: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>
  ) => Promise<Jeton>;

  constructor() {
    this.genereDemandeAutorisation = () =>
      Promise.resolve({ url: this.url, nonce: this.nonce, state: this.state });
    this.genereDemandeDeconnexion = () =>
      Promise.resolve({ url: this.url, state: this.state });
    this.recupereInformationsUtilisateur = () =>
      Promise.resolve({
        email: fakerFR.internet.email(),
        nom: fakerFR.person.lastName(),
        prenom: fakerFR.person.firstName(),
        siret: fakerFR.string.alpha(9),
      });
    this.recupereJeton = () =>
      Promise.resolve({
        idToken: fakerFR.string.alphanumeric(10),
        accessToken: fakerFR.string.alphanumeric(10),
      });
  }
}
