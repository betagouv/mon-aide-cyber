import { AdaptateurPDF } from "../../adaptateurs/AdaptateurPDF";
import { Diagnostic } from "../../diagnostic/Diagnostic";

export class AdaptateurPDFMAC implements AdaptateurPDF {
  genereRecommandations(diagnostic: Diagnostic): Promise<Buffer> {
    return Promise.resolve(
      Buffer.from(JSON.stringify(diagnostic.recommandations)),
    );
  }
}
