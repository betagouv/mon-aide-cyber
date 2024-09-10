export type FormatLien = `/api/${string}`;

export class LienRoutage {
  constructor(private readonly lien: FormatLien) {}

  route(): string {
    return this.lien.slice(this.lien.indexOf('/api') + 4);
  }

  url(): string {
    return this.lien;
  }
}
