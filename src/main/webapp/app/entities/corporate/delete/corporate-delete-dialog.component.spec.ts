jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CorporateService } from '../service/corporate.service';

import { CorporateDeleteDialogComponent } from './corporate-delete-dialog.component';

describe('Component Tests', () => {
  describe('Corporate Management Delete Component', () => {
    let comp: CorporateDeleteDialogComponent;
    let fixture: ComponentFixture<CorporateDeleteDialogComponent>;
    let service: CorporateService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CorporateDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(CorporateDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CorporateDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CorporateService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete('ABC');
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith('ABC');
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
