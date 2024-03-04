import { PartialType } from '@nestjs/mapped-types';
import { CreateKonyvDto } from './create-konyv.dto';

export class UpdateKonyvDto{
  cim : string;
  szerzo : string;
  kiadas_eve : string;
  constructor(cim: string, szerzo: string, kiadas_eve: string) {
    this.cim = cim;
    this.szerzo = szerzo;
    this.kiadas_eve = kiadas_eve;
  }
}
