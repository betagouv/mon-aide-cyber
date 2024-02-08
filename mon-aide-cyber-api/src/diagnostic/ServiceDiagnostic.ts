import { Diagnostic } from './Diagnostic';
import * as crypto from 'crypto';
import { Entrepots } from '../domaine/Entrepots';
import { ErreurMAC } from '../domaine/erreurMAC';

export class ServiceDiagnostic {
  constructor(private readonly entrepots: Entrepots) {}

  diagnostic = async (id: crypto.UUID): Promise<Diagnostic> =>
    await this.entrepots
      .diagnostic()
      .lis(id)
      .catch((erreur) =>
        Promise.reject(ErreurMAC.cree('Accès diagnostic', erreur)),
      );
}
