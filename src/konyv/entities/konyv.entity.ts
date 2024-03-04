export class Konyv {
  id : number;
  cim : string;
  szerzo : string;
  kiadas_eve : string;

  constructor(id: number, cim: string, szerzo: string, kiadas_eve: string) {
    this.id = id;
    this.cim = cim;
    this.szerzo = szerzo;
    this.kiadas_eve = kiadas_eve;
  }
}
