import { Test, TestingModule } from '@nestjs/testing';
import { KonyvService } from './konyv.service';
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('KonyvService', () => {
  let service: KonyvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KonyvService],
    }).compile();

    service = module.get<KonyvService>(KonyvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('read', () => {
    it('should return an empty by default', () => {
      expect(service.findAll()).toEqual([]);
    });

    it('should return undefined if id is unknown', () => {
      expect(service.findOne(42)).toBeUndefined();
    })

    it('should return a book with a known id', () => {
      service.create({cim : 'test', szerzo : 'Eret Nek', kiadas_eve : '123'});
      const konyv = service.findAll()[0];
      expect(service.findOne(konyv.id)).toEqual(konyv);
    })
  });

  describe('create', () => {
    it('should return a single book after create', () => {
      service.create({cim : 'test', szerzo : 'Eret Nek', kiadas_eve : '123'});
      expect(service.findAll()).toEqual([{id : expect.any(Number), cim : 'test', szerzo : 'Eret Nek', kiadas_eve : '123'}]);
    });

    it('should return 2 book after 2 create', () => {
      service.create({cim : 'test', szerzo : 'Eret Nek', kiadas_eve : '123'});
      service.create({cim : 'test2', szerzo : 'Eret Nek Jr.', kiadas_eve : '456'});
      expect(service.findAll()).toEqual([
        {id : expect.any(Number), cim : 'test', szerzo : 'Eret Nek', kiadas_eve : '123'},
        {id : expect.any(Number), cim : 'test2', szerzo : 'Eret Nek Jr.', kiadas_eve : '456'}
      ]);
    });

    it('should throw new BadRequestException', () => {
      expect( () => {
        service.create({cim : '', szerzo : '', kiadas_eve : ''});
      }).toThrow(new BadRequestException('Input cannot include empty spaces.'))
    })
  });

  describe('update', () => {
    it('should update correctly', () => {
      const konyv = service.create({cim : 'test', szerzo : 'Eret Nek', kiadas_eve : '123'});
      service.update(konyv.id, {cim : 'test2', szerzo : 'Eret Nek Jr', kiadas_eve : '456'});
      expect(service.findOne(konyv.id)).toEqual({id : konyv.id, cim : 'test2', szerzo : 'Eret Nek Jr', kiadas_eve : '456'});
    })

    it('should cause NotFoundException', () => {
      expect(() => {
        service.update(0, {cim : 'test2', szerzo : 'Eret Nek Jr', kiadas_eve : '456'});
      }).toThrow(NotFoundException);
    })

    it('should cause BadRequestException', () => {
      const konyv = service.create({cim : 'test', szerzo : 'Eret Nek', kiadas_eve : '123'});
      expect(() => {
        service.update(konyv.id, {cim : '', szerzo : '', kiadas_eve : ''});
      }).toThrow(new BadRequestException('Input cannot include empty spaces.'));
    })
  })

  describe('delete', () => {
    it('should delete the correct item', () => {
      const konyv = service.create({cim : 'test', szerzo : 'Eret Nek', kiadas_eve : '123'});
      const konyv2 = service.create({cim : 'test', szerzo : 'Eret Nek', kiadas_eve : '123'});
      service.remove(konyv.id);
      expect(service.findOne(konyv.id)).toBeUndefined();
      expect(service.findOne(konyv2.id)).toEqual(konyv2);
    })

    it('should delete one item', () => {
      service.create({cim : 'test', szerzo : 'Eret Nek', kiadas_eve : '123'});
      const konyv2 = service.create({cim : 'test', szerzo : 'Eret Nek', kiadas_eve : '123'});
      service.remove(konyv2.id);
      expect(service.findAll().length).toEqual(1);
    })

    it('should cause NotFoundException', () => {
      expect(() => {
        service.remove(0);
      }).toThrow(NotFoundException);
    })
  })

});
