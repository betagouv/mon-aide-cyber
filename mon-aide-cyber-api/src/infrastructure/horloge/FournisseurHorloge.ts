export class FournisseurHorloge {
  static maintenant = (): Date => new Date();

  static enDate = (date: string): Date => new Date(Date.parse(date));

  static formateDate = (date: Date): { date: string; heure: string } => {
    const dateFormatee = new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeZone: 'Europe/Paris',
    })
      .format(date)
      .replace(/\//g, '.');
    const heureFormatee = new Intl.DateTimeFormat('fr-FR', {
      timeStyle: 'short',
      hourCycle: 'h24',
      timeZone: 'Europe/Paris',
    }).format(date);
    return {
      date: dateFormatee,
      heure: heureFormatee,
    };
  };
}
