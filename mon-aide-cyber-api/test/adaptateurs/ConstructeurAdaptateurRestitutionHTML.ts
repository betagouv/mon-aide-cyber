import { Indicateurs, MesurePriorisee } from '../../src/diagnostic/Diagnostic';

import { Restitution } from '../../src/restitution/Restitution';
import { ContenuHtml } from '../../src/adaptateurs/AdaptateurDeRestitution';
import { AdaptateurDeRestitutionHTML } from '../../src/infrastructure/adaptateurs/AdaptateurDeRestitutionHTML';

class ConstructeurAdaptateurRestitutionHTML {
  private corpsMesuresPrioritaires = '';
  private corpsIndicateurs = '';
  private corpsAutresMesures = '';

  construis(): AdaptateurDeRestitutionHTML {
    const corpsMesuresPriorisees = this.corpsMesuresPrioritaires;
    const corpsIndicateurs = this.corpsIndicateurs;
    const corpsAutresMesures = this.corpsAutresMesures;

    return new (class extends AdaptateurDeRestitutionHTML {
      protected genereInformations(
        restitution: Restitution
      ): Promise<ContenuHtml> {
        return Promise.resolve({
          entete: '',
          corps: restitution.informations
            ? JSON.stringify(restitution.informations)
            : '',
          piedPage: '',
        });
      }

      protected genereMesuresPrioritaires(
        _: MesurePriorisee[] | undefined
      ): Promise<ContenuHtml> {
        return Promise.resolve({
          entete: '',
          corps: corpsMesuresPriorisees,
          piedPage: '',
        });
      }

      protected genereIndicateurs(
        _: Indicateurs | undefined
      ): Promise<ContenuHtml> {
        return Promise.resolve({
          entete: '',
          corps: corpsIndicateurs,
          piedPage: '',
        });
      }

      protected genereAutresMesures(
        _: MesurePriorisee[]
      ): Promise<ContenuHtml> {
        return Promise.resolve({
          entete: '',
          corps: corpsAutresMesures,
          piedPage: '',
        });
      }

      protected genereContactsEtLiensUtiles(): Promise<ContenuHtml> {
        return Promise.resolve({
          entete: '',
          corps: '',
          piedPage: '',
        });
      }

      protected genereRessources(): Promise<ContenuHtml> {
        return Promise.resolve({
          entete: '',
          corps: '',
          piedPage: '',
        });
      }
    })();
  }

  avecMesuresPrioritaires(
    mesuresPrioritaires: string
  ): ConstructeurAdaptateurRestitutionHTML {
    this.corpsMesuresPrioritaires = mesuresPrioritaires;

    return this;
  }

  avecIndicateurs(indicateurs: string): ConstructeurAdaptateurRestitutionHTML {
    this.corpsIndicateurs = indicateurs;

    return this;
  }

  avecAutresMesures(
    autresMesures: string
  ): ConstructeurAdaptateurRestitutionHTML {
    this.corpsAutresMesures = autresMesures;

    return this;
  }
}

export const unAdaptateurDeRestitutionHTML = () =>
  new ConstructeurAdaptateurRestitutionHTML();
