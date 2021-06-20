import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CustomerDetailComponent } from './customer-detail.component';

describe('Component Tests', () => {
  describe('Customer Management Detail Component', () => {
    let comp: CustomerDetailComponent;
    let fixture: ComponentFixture<CustomerDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CustomerDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ customer: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(CustomerDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CustomerDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load customer on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.customer).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
