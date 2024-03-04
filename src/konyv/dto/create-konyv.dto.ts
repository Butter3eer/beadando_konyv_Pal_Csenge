export class CreateKonyvDto {
  cim : string;
  szerzo : string;
  kiadas_eve : string;
  constructor(cim: string, szerzo: string, kiadas_eve: string) {
    this.cim = cim;
    this.szerzo = szerzo;
    this.kiadas_eve = kiadas_eve;
  }
}
