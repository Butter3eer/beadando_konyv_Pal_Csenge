import { Controller} from '@nestjs/common';
import { KonyvService } from './konyv.service';
import { CreateKonyvDto } from './dto/create-konyv.dto';
import { UpdateKonyvDto } from './dto/update-konyv.dto';

@Controller('konyv')
export class KonyvController {
  constructor(private readonly konyvService: KonyvService) {}

  create(createKonyvDto: CreateKonyvDto) {
    return this.konyvService.create(createKonyvDto);
  }

  findAll() {
    return this.konyvService.findAll();
  }

  findOne(id: number) {
    return this.konyvService.findOne(id);
  }

  update(id: number, updateKonyvDto: UpdateKonyvDto) {
    return this.konyvService.update(id, updateKonyvDto);
  }

  remove(id: number) {
    return this.konyvService.remove(id);
  }
}
