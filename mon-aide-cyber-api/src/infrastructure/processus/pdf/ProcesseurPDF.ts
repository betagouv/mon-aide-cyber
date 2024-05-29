import { Processeur } from '../../../processus/Processus';
import { fork } from 'node:child_process';

export class ProcesseurPDF<V> implements Processeur<Buffer, V> {
  execute(
    donnees: V,
    enSucces: (resultat: Buffer) => void,
    enErreur: (message: string) => void,
  ): void {
    const processusGenerationPdf = fork(
      `${__dirname}/generateurPdfScript.ts`,
      [JSON.stringify(donnees)],
      {
        execArgv: ['-r', 'ts-node/register'],
      },
    );
    console.log(`[parent][${processusGenerationPdf.pid}] - Processus lancé`);

    processusGenerationPdf.on('message', (pdf: MessageType<Buffer>) => {
      console.log(`[parent][${processusGenerationPdf.pid}] - Message reçu`);
      const data = pdf['data'];
      enSucces(Buffer.from(data));
    });

    processusGenerationPdf.on('exit', (code, signal) => {
      console.log(
        `[parent][${processusGenerationPdf.pid}] - Processus terminé.`,
      );
      if (code !== 0) {
        enErreur(`générateur a reçu code: ${code} et signal: ${signal}`);
      }
    });

    processusGenerationPdf.on('error', (message) => {
      enErreur(message.message);
    });
  }
}

type MessageType<T> = {
  type: string;
  data: T;
};
