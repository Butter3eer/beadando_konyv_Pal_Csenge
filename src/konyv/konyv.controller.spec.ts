import { Test, TestingModule } from "@nestjs/testing";
import { KonyvController } from "./konyv.controller";
import { KonyvService } from "./konyv.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateKonyvDto } from "./dto/create-konyv.dto";
import { Konyv } from "./entities/konyv.entity";
import { UpdateKonyvDto } from "./dto/update-konyv.dto";

describe('KonyvController', () => {
  let controller: KonyvController;
  let mockKonyvek : Konyv[];

  beforeEach(async () => {

    mockKonyvek = [{id : 42, cim : 'test', szerzo : 'Gipsz Jakab', kiadas_eve : '1298'}];

    const mockKonyvService = {
      findAll : () => {return mockKonyvek;},
      findOne(id: number) {
        return mockKonyvek.find(konyv => konyv.id === id);
      },
      create(konyv : CreateKonyvDto) {
        if(konyv.cim === '' || konyv.szerzo === '' || konyv.kiadas_eve === '') {
          throw new BadRequestException('Input cannot include empty spaces.');
        }

        const id = Math.random() * 0.1;
        const ujKonyv = new Konyv(id, konyv.cim, konyv.szerzo, konyv.kiadas_eve);
        mockKonyvek.push(ujKonyv);
        return ujKonyv;
      },
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
      },
      remove(id : number) {
        const index = mockKonyvek.findIndex(konyv => konyv.id === id);

        if (index === -1) {
          throw new NotFoundException();
        }
        else {
          mockKonyvek.splice(index, 1);
          return mockKonyvek;
        }
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [KonyvController],
      providers: [{
        provide : KonyvService,
        useValue : mockKonyvService
      }],
    }).compile();

    controller = module.get<KonyvController>(KonyvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the list of books returned by konyvService.findAll()', () => {
    expect(mockKonyvek).toEqual([{id : 42, cim : 'test', szerzo : 'Gipsz Jakab', kiadas_eve : '1298'}]);
  });

  it('should return the correct koynv', () => {
    expect(controller.findOne(42)).toEqual({id : 42, cim : 'test', szerzo : 'Gipsz Jakab', kiadas_eve : '1298'});
  });

  it('should create the correct todo', () => {
    const konyv = controller.create({cim : 'test2', szerzo : 'Gipsz Elek', kiadas_eve : '3456'});
    const ellenorzo = {id : expect.any(Number), cim : 'test2', szerzo : 'Gipsz Elek', kiadas_eve : '3456'};
    expect(konyv).toEqual(ellenorzo);
  })

  it('should delete one book as well', () => {
    controller.remove(42);
    expect(mockKonyvek).toEqual([]);
  })

  it('should delete the correct item', () => {
    const konyv = controller.create({cim : 'test2', szerzo : 'Gipsz Elek', kiadas_eve : '3456'});
    const konyv2 = controller.create({cim : 'test3', szerzo : 'Gipsz Mark', kiadas_eve : '123'});
    controller.remove(konyv2.id);
    expect(controller.findOne(konyv2.id)).toBeUndefined();
    expect(controller.findOne(konyv.id)).toEqual(konyv);
  })

  it('should update correctly', () => {
    controller.update(42, {cim : 'test420', szerzo : 'Papp Lak', kiadas_eve : '8364'});
    expect(controller.findOne(42)).toEqual({id : 42, cim : 'test420', szerzo : 'Papp Lak', kiadas_eve : '8364'});
  })

  it('should update the correct book', () =>{
    const konyv = controller.create({cim : 'test2', szerzo : 'Gipsz Elek', kiadas_eve : '3456'});
    const konyv2 = controller.create({cim : 'test3', szerzo : 'Gipsz Mark', kiadas_eve : '123'});
    controller.update(konyv2.id, {cim : 'test420', szerzo : 'Papp Lak', kiadas_eve : '8364'});
    expect(controller.findOne(konyv.id)).toEqual(konyv);
    expect(controller.findOne(konyv2.id)).toEqual({id : konyv2.id, cim : 'test420', szerzo : 'Papp Lak', kiadas_eve : '8364'})
  })

  it('should cause NotFoundException on remove', () => {
    expect(() => {
      controller.remove(0);
    }).toThrow(NotFoundException);
  })

  it('should cause NotFoundException on update', () => {
    expect(() => {
      controller.update(0, {cim : 'test2', szerzo : 'Eret Nek Jr', kiadas_eve : '456'});
    }).toThrow(NotFoundException);
  })

  it('should delete one item', () => {
    const konyv2 = controller.create({cim : 'test', szerzo : 'Eret Nek', kiadas_eve : '123'});
    controller.remove(konyv2.id);
    expect(controller.findAll().length).toEqual(1);
  })

  it('should cause BadRequestException on create', () => {
    expect(() => {
      controller.create({cim : '', szerzo : '', kiadas_eve : ''});
    }).toThrow(new BadRequestException('Input cannot include empty spaces.'));
  })

  it('should cause BadRequestException on update', () => {
    const konyv2 = controller.create({cim : 'test', szerzo : 'Eret Nek', kiadas_eve : '123'});
    expect(() => {
      controller.update(konyv2.id, {cim : '', szerzo : '', kiadas_eve : ''});
    }).toThrow(new BadRequestException('Input cannot include empty spaces.'));
  })
});
