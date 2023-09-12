import { Diagnostic } from "../diagnostic/Diagnostic";

export type AdaptateurPDF = {
  genereRecommandations: (diagnostic: Diagnostic) => Promise<Buffer>;
};
