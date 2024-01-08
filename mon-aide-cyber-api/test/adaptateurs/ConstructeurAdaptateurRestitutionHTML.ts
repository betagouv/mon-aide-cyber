import {
  Indicateurs,
  RecommandationPriorisee,
} from '../../src/diagnostic/Diagnostic';
import { ContenuHtml } from '../../src/infrastructure/adaptateurs/AdaptateurDeRestitutionPDF';

import { AdaptateurDeRestitutionHTML } from '../../src/adaptateurs/AdaptateurDeRestitutionHTML';

class ConstructeurAdaptateurRestitutionHTML {
  private corpsMesuresPrioritaires = '';
  private corpsIndicateurs = '';
  private corpsAutresMesures = '';

  construis(): AdaptateurDeRestitutionHTML {
    const corpsMesuresPriorisees = this.corpsMesuresPrioritaires;
    const corpsIndicateurs = this.corpsIndicateurs;
    const corpsAutresMesures = this.corpsAutresMesures;

    return new (class extends AdaptateurDeRestitutionHTML {
      constructor() {
        super(new Map());
      }

      protected genereMesuresPrioritaires(
        _: RecommandationPriorisee[] | undefined,
      ): Promise<ContenuHtml> {
        return Promise.resolve({
          entete: '',
          corps: corpsMesuresPriorisees,
          piedPage: '',
        });
      }

      protected genereIndicateurs(
        _: Indicateurs | undefined,
      ): Promise<ContenuHtml> {
        return Promise.resolve({
          entete: '',
          corps: corpsIndicateurs,
          piedPage: '',
        });
      }

      protected genereAutresMesures(
        _: RecommandationPriorisee[],
      ): Promise<ContenuHtml> {
        return Promise.resolve({
          entete: '',
          corps: corpsAutresMesures,
          piedPage: '',
        });
      }
    })();
  }

  avecMesuresPrioritaires(
    mesuresPrioritaires: string,
  ): ConstructeurAdaptateurRestitutionHTML {
    this.corpsMesuresPrioritaires = mesuresPrioritaires;

    return this;
  }

  avecIndicateurs(indicateurs: string): ConstructeurAdaptateurRestitutionHTML {
    this.corpsIndicateurs = indicateurs;

    return this;
  }

  avecAutresMesures(
    autresMesures: string,
  ): ConstructeurAdaptateurRestitutionHTML {
    this.corpsAutresMesures = autresMesures;

    return this;
  }
}

export const unAdaptateurDeRestitutionHTML = () =>
  new ConstructeurAdaptateurRestitutionHTML();
