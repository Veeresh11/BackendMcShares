import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICustomer, Customer } from '../customer.model';
import { CustomerService } from '../service/customer.service';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { IShares } from 'app/entities/shares/shares.model';
import { SharesService } from 'app/entities/shares/service/shares.service';

@Component({
  selector: 'jhi-customer-update',
  templateUrl: './customer-update.component.html',
})
export class CustomerUpdateComponent implements OnInit {
  isSaving = false;

  addressesCollection: IAddress[] = [];
  sharesCollection: IShares[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    phone: [],
    address: [],
    share: [],
  });

  constructor(
    protected customerService: CustomerService,
    protected addressService: AddressService,
    protected sharesService: SharesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customer }) => {
      this.updateForm(customer);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customer = this.createFromForm();
    if (customer.id !== undefined) {
      this.subscribeToSaveResponse(this.customerService.update(customer));
    } else {
      this.subscribeToSaveResponse(this.customerService.create(customer));
    }
  }

  trackAddressById(index: number, item: IAddress): number {
    return item.id!;
  }

  trackSharesById(index: number, item: IShares): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomer>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(customer: ICustomer): void {
    this.editForm.patchValue({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      share: customer.share,
    });

    this.addressesCollection = this.addressService.addAddressToCollectionIfMissing(this.addressesCollection, customer.address);
    this.sharesCollection = this.sharesService.addSharesToCollectionIfMissing(this.sharesCollection, customer.share);
  }

  protected loadRelationshipsOptions(): void {
    this.addressService
      .query({ filter: 'customer-is-null' })
      .pipe(map((res: HttpResponse<IAddress[]>) => res.body ?? []))
      .pipe(
        map((addresses: IAddress[]) => this.addressService.addAddressToCollectionIfMissing(addresses, this.editForm.get('address')!.value))
      )
      .subscribe((addresses: IAddress[]) => (this.addressesCollection = addresses));

    this.sharesService
      .query({ filter: 'customer-is-null' })
      .pipe(map((res: HttpResponse<IShares[]>) => res.body ?? []))
      .pipe(map((shares: IShares[]) => this.sharesService.addSharesToCollectionIfMissing(shares, this.editForm.get('share')!.value)))
      .subscribe((shares: IShares[]) => (this.sharesCollection = shares));
  }

  protected createFromForm(): ICustomer {
    return {
      ...new Customer(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      address: this.editForm.get(['address'])!.value,
      share: this.editForm.get(['share'])!.value,
    };
  }
}
