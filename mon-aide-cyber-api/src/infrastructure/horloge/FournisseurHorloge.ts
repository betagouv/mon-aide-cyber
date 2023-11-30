export class FournisseurHorloge {
  static maintenant = (): Date => new Date();

  static enDate = (date: string): Date => new Date(Date.parse(date));
}
