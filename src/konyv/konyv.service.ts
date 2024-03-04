import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateKonyvDto } from './dto/create-konyv.dto';
import { UpdateKonyvDto } from './dto/update-konyv.dto';
import { Konyv } from "./entities/konyv.entity";
import { isEmpty } from "rxjs";

@Injectable()
export class KonyvService {

  private readonly konyvek : Konyv[] = [];

  create(createKonyvDto: CreateKonyvDto) {
    if(createKonyvDto.cim === '' || createKonyvDto.szerzo === '' || createKonyvDto.kiadas_eve === '') {
      throw new BadRequestException('Input cannot include empty spaces.');
    }

    const id = Math.random() * 0.1;
    const ujKonyv = new Konyv(id, createKonyvDto.cim, createKonyvDto.szerzo, createKonyvDto.kiadas_eve);
    this.konyvek.push(ujKonyv);
    return ujKonyv;
  }

  findAll() {
    return this.konyvek;
  }

  findOne(id: number) {
    return this.konyvek.find(konyv => konyv.id === id);
  }

  update(id: number, updateKonyvDto: UpdateKonyvDto) {

    const konyv = this.findOne(id);

    if(updateKonyvDto.cim === '' || updateKonyvDto.szerzo === '' || updateKonyvDto.kiadas_eve === '') {
      throw new BadRequestException('Input cannot include empty spaces.');
    } else if (!konyv) {
      throw new NotFoundException();
    }

    konyv.cim = updateKonyvDto.cim;
    konyv.szerzo = updateKonyvDto.szerzo;
    konyv.kiadas_eve = updateKonyvDto.kiadas_eve
    return konyv;
  }

  remove(id: number) {
    const index = this.konyvek.findIndex(konyv => konyv.id === id);

    if (index === -1) {
      throw new NotFoundException();
    }
    else {
      this.konyvek.splice(index, 1);
      return this.konyvek;
    }
  }
}
