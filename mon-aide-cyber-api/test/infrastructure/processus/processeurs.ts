import { Processeur } from '../../../src/processus/Processus';

export class ProcesseurPDFDeTest<T> implements Processeur<Buffer, T> {
  private _aEteExecute = false;
  execute(
    _donnees: T,
    enSucces: (resultat: Buffer) => void,
    _enErreur: (message: string) => void,
  ): void {
    this._aEteExecute = true;
    enSucces(Buffer.from('PDF Mesures généré'));
  }

  aEteExecute(): boolean {
    return this._aEteExecute;
  }
}
