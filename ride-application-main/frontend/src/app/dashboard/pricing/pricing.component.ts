import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/Service/auth.service";
import { PricingService } from "src/app/Service/pricing.service";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-pricing",
  templateUrl: "./pricing.component.html",
  styleUrls: ["./pricing.component.css"],
})
export class PricingComponent implements OnInit {
  showButton: boolean = true;
  addForm: boolean = false;
  pricingForm!: FormGroup;
  isEditMode: boolean = false;
  countriesname: any[] = [];
  citiesname: any[] = [];
  serviceData: any[] = [];
  distbasePriceArray: number[] = [1, 2, 3, 4];
  selectedDistance!: number;
  selectedCountry: any;
  selectedCity: any;
  selectedVehicle: any;
  valueArray: any[] = [];
  searchValue: string = '';
  limit: number = 5;
  currentPage: number = 1;
  totalPages: number = 0;
  paginatedData: any[] = [];
  id: any;
  
  // Animation states
  isCountryLoading: boolean = false;
  isCityLoading: boolean = false;
  isServiceLoading: boolean = false;
  formAnimationClass: string = '';

  constructor(
    private readonly toastr: ToastrService,
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly _pricing: PricingService,
    private readonly spinner: NgxSpinnerService,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getCountry()
    this.searchPrice();

    this.pricingForm = this.formBuilder.group({
      country: ["", [Validators.required]],
      city: ["", [Validators.required]],
      service: ["", [Validators.required]],
      driverprofit: ["", [Validators.required]],
      minfare: ["", [Validators.required]],
      distancebaseprice: ["", [Validators.required]],
      baseprice: ["", [Validators.required]],
      ppudist: ["", [Validators.required]],
      pputime: ["", [Validators.required]],
      maxspace: ["", [Validators.required]],
    });
  }


  getCountry(): void {
    this.isCountryLoading = true;
    this._pricing.getCountryData().subscribe({
      next: (res: any) => {
        console.log("Countries:", res.countrydata);
        this.countriesname = res.countrydata;
        this.isCountryLoading = false;
      },
      error: (err) => {
        console.error("Failed to load countries", err);
        this.isCountryLoading = false;
        this.toastr.error('Failed to load countries');
      }
    });
  }
onSelectedCountry(event: Event): void {
  const selectedId = (event.target as HTMLSelectElement).value;
  console.log('Selected country ID:', selectedId);
  this.selectedCountry = selectedId;
  
  // Reset city and service data when country changes
  this.citiesname = [];
  this.serviceData = [];
  this.selectedCity = null;
  this.selectedVehicle = null;
  
  // Update form controls
  this.pricingForm.patchValue({
    city: '',
    service: ''
  });
  
  if (selectedId) {
    this.getCity();
  }
}



  // -----------------GET CITY DATA---------------
  getCity(): void {
    if (!this.selectedCountry) {
      this.citiesname = [];
      return;
    }
    
    this.isCityLoading = true;
    this._pricing.getCityData().subscribe({
      next: (response: any) => {
        console.log('All cities:', response);
        const filteredCities = response.citydata.filter((city: any) => {
          return city.countryDetails && city.countryDetails._id === this.selectedCountry;
        });
        console.log('Filtered cities:', filteredCities);
        this.citiesname = filteredCities;
        this.isCityLoading = false;
        
        if (filteredCities.length === 0) {
          this.toastr.info('No cities available for selected country');
        }
      },
      error: (error) => {
        console.log('Error loading cities:', error.error?.message || error.message);
        this.citiesname = [];
        this.isCityLoading = false;
        this.toastr.error('Failed to load cities');
      },
    });
  }
onSelectedCity(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  this.selectedCity = selectElement.value;
  console.log('Selected city ID:', this.selectedCity);
  
  // Reset service data when city changes
  this.serviceData = [];
  this.selectedVehicle = null;
  this.pricingForm.patchValue({
    service: ''
  });
  
  if (this.selectedCity && this.selectedCountry) {
    this.getService();
  }
}


  // -----------------GET SERVICE DATA---------------
  getService(): void {
    if (!this.selectedCity || !this.selectedCountry) {
      this.serviceData = [];
      return;
    }
    
    this.isServiceLoading = true;
    this._pricing.getServiceData({city: this.selectedCity, country: this.selectedCountry}).subscribe({
      next: (response) => {
        this.serviceData = response.data;
        this.isServiceLoading = false;
        
        if (this.serviceData.length === 0) {
          this.toastr.info('No services available for selected city');
        }
      },
      error: (error) => {
        console.log('Error loading services:', error.error?.message || error.message);
        this.serviceData = [];
        this.isServiceLoading = false;
        this.toastr.error('Failed to load services');
      },
    });
  }
  onSelectedVehicle(service: any): void {
    this.selectedVehicle = service;
    const value = this.valueArray.filter((obj: any) => {
      return (
        this.pricingForm.value.country === obj.country &&
        this.pricingForm.value.city === obj.city &&
        this.pricingForm.value.service === obj.service
        )
      });
    console.log(this.valueArray)
    console.log(this.pricingForm.value.country)
    console.log(value);
    if(value.length > 0){
      this.toastr.warning("This CarService Already Exist in This CIty");
    }
  }

  // -----------------Distance Base Price DATA---------------
  onSelectDistance(distance: number) {
    this.selectedDistance = distance;
    console.log(distance);
  }
  
  // -------------------------------------------------NG SUBMIT FXN---------------------------------------------------------
  onSubmit() {
    if (this.isEditMode) {
      this.UpdatePricing();
    } else {
      this.AddPricing();
    }
  }

  // --------------------------------------------ADD VEHICLE PRICING FXN---------------------------------------------
  AddPricing() {
    const formValues = this.pricingForm.value;

    if (this.pricingForm.valid) {
      this._pricing.addPricing(formValues).subscribe({
        next: (response: any) => {
          console.log(response);
          this.valueArray.push(response.pricingData);
          this.searchPrice();
          this.pricingForm.reset();
          this.addForm = false;
          this.toastr.success(response.message);
        },
        error: (error: any) => {
          console.log(error.error.message);
          this.toastr.warning(error.message);
        },
      });
    } else {
      this.toastr.warning("All Fields are Required");
    }
  }

  //--------------------------------------------GET VEHICLE PRICING DATA FXN---------------------------------------------
  searchPrice() {
    this._pricing.getPricingData(this.currentPage, this.limit).subscribe({
      next: (response: any) => {
        console.log(response)
        this.valueArray = response.pricingdata;
        this.totalPages = response.totalPage;
        this.updatePaginatedPrices();
      },
      error: (error: any) => {
        console.log(error.message);
      }
  });
  }
  onPageSizeChange(event: any): void {
    this.limit = parseInt(event.target.value);
    this.currentPage = 1;
    // Update the paginatedDrivers array based on the new limit and current page
    this.updatePaginatedPrices();
    this.searchPrice();
  }
  onPageChange(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      console.log(pageNumber)
    // Update the paginatedDrivers array based on the new page
    // this.updatePaginatedPrices();
    this.searchPrice();
    }
  }
  getPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, index) => index + 1);
  }
  updatePaginatedPrices() {
    const startIndex = (this.currentPage - 1) * this.limit;
    const endIndex = startIndex + this.limit;
    this.paginatedData = this.valueArray.slice(startIndex, endIndex);
  }
  // --------------------------------------------DELETE VEHICLE PRICING FXN---------------------------------------------
  deleteValues(id: any) {
    console.log(id);
    const confirmation = confirm("Are you sure you want to Delete?");

    if (confirmation) {
      this._pricing.deleteValues(id).subscribe({
        next: (response: any) => {
          console.log(response);
          this.searchPrice();
          this.toastr.success(response.message);
        },
        error: (error: any) => {
          console.log(error.error.message);
          this.toastr.error(error.error.message);
        },
      });
    }
  }

  // --------------------------------------------UPDATE VEHICLE PRICING FXN---------------------------------------------
  editbtn(values: any) {
    this.isEditMode = true;
    this.addForm = true;

    this.id = values._id;
    
    this.pricingForm.patchValue({
      country: values.countryDetails.countryName,
      city: values.cityDetails.city,
      service:values.serviceDetails.vehicleName,
      driverprofit: values.driverprofit,
      minfare: values.minfare,
      distancebaseprice: values.distancebaseprice,
      baseprice: values.baseprice,
      ppudist: values.ppudist,
      pputime: values.pputime,
      maxspace: values.maxspace,
    });
      this.cd.detectChanges();
  }

  UpdatePricing() {
    const data = {
      driverprofit: this.pricingForm.value.driverprofit,
      minfare: this.pricingForm.value.minfare,
      distancebaseprice: this.pricingForm.value.distancebaseprice,
      baseprice: this.pricingForm.value.baseprice,
      ppudist: this.pricingForm.value.ppudist,
      pputime: this.pricingForm.value.pputime,
      maxspace: this.pricingForm.value.maxspace,
    }
    console.log(data);
    

    this._pricing.UpdatePricing(this.id, data).subscribe({
      next: (response: any) => {
        console.log(response);
        this.valueArray.push(response.pricingData);
        this.searchPrice();
        this.pricingForm.reset();
        this.addForm = false;
        this.toastr.success(response.message);
      },
      error: (error: any) => {
        console.log(error);
        this.toastr.warning(error.message);
      },
    });
  }


  // ----------------------------------------BUTTONS CONTROL PANEL---------------------------------------------
  toggleFormVisibility() {
    this.addForm = !this.addForm;
    this.isEditMode = false;
    this.formAnimationClass = 'fade-in-form';
    
    // Reset form and data
    this.pricingForm.reset();
    this.selectedCountry = null;
    this.selectedCity = null;
    this.selectedVehicle = null;
    this.citiesname = [];
    this.serviceData = [];
    
    this.pricingForm.patchValue({
      country: '',
      city: '',
      service: '',
      distancebaseprice: '',
    });
  }
  CancelForm() {
    this.addForm = false;
    this.showButton = true;
    this.isEditMode = false;
    
    // Reset all states
    this.selectedCountry = null;
    this.selectedCity = null;
    this.selectedVehicle = null;
    this.citiesname = [];
    this.serviceData = [];
    this.isCountryLoading = false;
    this.isCityLoading = false;
    this.isServiceLoading = false;
    this.formAnimationClass = '';
    
    this.pricingForm.reset();
    this.pricingForm.patchValue({
      country: '',
      city: '',
      service: '',
      distancebaseprice: '',
    });
  }

  resetTimer() {
    this.authService.resetInactivityTimer();
  }
}
