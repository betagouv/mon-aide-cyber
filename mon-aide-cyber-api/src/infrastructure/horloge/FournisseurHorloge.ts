import { format } from 'date-fns';

export class FournisseurHorloge {
  static maintenant = (): Date => new Date();

  static enDate = (date: string): Date => new Date(Date.parse(date));

  static formateDate = (date: Date): { date: string; heure: string } => {
    return {
      date: format(date, 'dd.MM.yyyy'),
      heure: format(date, 'HH:mm'),
    };
  };
}
