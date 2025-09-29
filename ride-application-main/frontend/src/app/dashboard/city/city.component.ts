import { Component, OnInit, NgZone } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { CityService } from "../../Service/city.service";
import { AuthService } from "src/app/Service/auth.service";
declare var google: any;

@Component({
  selector: "app-city",
  templateUrl: "./city.component.html",
  styleUrls: ["./city.component.css"],
})
export class CityComponent implements OnInit {
  cityForm!: FormGroup;

  // Map-related variables
  map: any;
  marker: any;
  directionsService: any;
  directionsRenderer: any;

  // Route-related
  startLocation: string = "";
  endLocation: string = "";
  totalDistance: number = 0;
  totalHours: number = 0;
  totalMinutes: number = 0;
  estimateTime: string = "";
  totalTime: number = 0;

  // City Data
  cityIndex: number = -1;
  cities: any[] = []; // fetched from DB
  vehiclesPricing: any[] = [];

 page: number = 1;
limit: number = 10;
cityList: any[] = [];
count: number = 0;
cityData: any[] = [];
selectedCityId: string = '';
countryData: any[] = [];

isaddbutton: boolean = true;
isupdatebutton: boolean = false;



  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _city: CityService,
    private authService: AuthService,
    private zone: NgZone
  ) {
    this.cityForm = this.fb.group({
      countryname: ["", Validators.required],
      cityname: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    // this.getCItyData();
    this.getcountryData();
    this.initMap();
    this.getcity(this.page, this.limit);
  }

  initMap() {
    const defaultCenter = new google.maps.LatLng(12.9716, 77.5946); // Bangalore
    const mapOptions = {
      center: defaultCenter,
      zoom: 10,
    };
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, mapOptions);

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);

    this.setUpAutocomplete();
  }

  setUpAutocomplete() {
    const startInput = document.getElementById("start-location") as HTMLInputElement;
    const endInput = document.getElementById("end-location") as HTMLInputElement;

    const startAutocomplete = new google.maps.places.Autocomplete(startInput);
    const endAutocomplete = new google.maps.places.Autocomplete(endInput);

    startAutocomplete.addListener("place_changed", () => {
      this.zone.run(() => {
        const place = startAutocomplete.getPlace();
        if (place && place.formatted_address) {
          this.startLocation = place.formatted_address;
        }
      });
    });

    endAutocomplete.addListener("place_changed", () => {
      this.zone.run(() => {
        const place = endAutocomplete.getPlace();
        if (place && place.formatted_address) {
          this.endLocation = place.formatted_address;
          this.calculateRoute(); // trigger when destination is selected
        }
      });
    });
  }

  calculateRoute() {
    if (!this.startLocation || !this.endLocation) return;

    const request = {
      origin: this.startLocation,
      destination: this.endLocation,
      travelMode: "DRIVING",
    };

    this.directionsService.route(request, (response: any, status: any) => {
      if (status === "OK") {
        this.directionsRenderer.setDirections(response);
        this.drawRoute(response);
      } else {
        this.toastr.error("Route not found!");
      }
    });
  }

drawRoute(response: any): void {
  const route = response.routes[0];

  let totalDistance = 0;
  let totalDuration = 0;

  for (let leg of route.legs) {
    totalDistance += leg.distance.value; // in meters
    totalDuration += leg.duration.value; // in seconds
  }

  this.totalDistance = totalDistance / 1000; // in km
  this.totalTime = totalDuration / 60; // in mins
  this.totalHours = Math.floor(totalDuration / 3600);
  this.totalMinutes = Math.floor((totalDuration % 3600) / 60);
  this.estimateTime = `${this.totalHours} hr ${this.totalMinutes} min`;

  console.log("Distance:", this.totalDistance, "km");
  console.log("Estimated Time:", this.estimateTime);

  this.cityIndex = this.cities.findIndex((city: any) => {
    return (
      this.startLocation.toLowerCase().includes(city.city.toLowerCase()) ||
      this.endLocation.toLowerCase().includes(city.city.toLowerCase())
    );
  });

  if (this.cityIndex === -1) {
    this.toastr.error("No matching city found in database.");
    return;
  }

  // ✅ Set the directions to the map here
  if (this.directionsRenderer) {
    this.directionsRenderer.setDirections(response);
  }

  // 🔁 Continue with pricing
  this.getVehiclePricing(this.cityIndex);
}


  getVehiclePricing(index: number) {
    const cityId = this.cities[index]._id;

    this._city.getServiceType(cityId).subscribe({
      next: (response: any) => {
        this.vehiclesPricing = response.pricingdata;
        this.vehiclesPricing.forEach((vp: any) => {
          this.calculateFare(vp);
        });
        console.log("Vehicle Pricing:", this.vehiclesPricing);
      },
      error: (err) => this.toastr.error("Failed to load pricing"),
    });
  }

  calculateFare(vehiclePricing: any) {
    vehiclePricing.estimatedFare = this.totalDistance * vehiclePricing.ratePerKm;
  }

  // ---------------------- STUB FUNCTIONS FOR MISSING METHODS -----------------------

  getcity(page: number, limit: number): void {
  this._city.getcity(page, limit).subscribe({
    next: (response) => {
      this.cityList = response.data || response; // Adjust based on your backend structure
    },
    error: (err) => {
      console.error("Error fetching city data", err);
    }
  });
}
  getcountryData() {
    // Simulate country list
    console.log("Fetching countries...");
  }

  onSelected(countryId: string) {
  console.log("Selected Country ID:", countryId);

  // You can optionally filter cities or perform some logic here
  // For example:
  // this.cityData = this.cityData.filter(city => city.countryDetails?._id === countryId);

  // Or simply store selected country if needed
  this.cityForm.patchValue({
    countryname: countryId
  });
}

  selectLocation(location: string) {
    console.log("Selected:", location);
  }

  onPlaceChanged(place: any) {
    console.log("Place changed:", place);
  }

  onPageChange(page: number): void {
  this.page = page;
  this.getcity(this.page, this.limit); // Make sure getcity() is implemented
}

  resetTimer() {
    this.authService.resetInactivityTimer();
  }


checkZone_AddCity() {
  const formData = this.cityForm.value;
  console.log("Adding city:", formData);
  // add your POST request logic here
}

updateCity() {
  const formData = this.cityForm.value;
  console.log("Updating city:", formData);
  // add your PUT request logic here
}

editbtn(id: string, city: any) {
  this.isaddbutton = false;
  this.isupdatebutton = true;
  this.cityForm.patchValue({
    cityname: city.city,
    countryname: city.countryDetails?._id
  });
  // store ID to use in update
  this.selectedCityId = id;
}

onPageSizeChange(event: any) {
  this.limit = +event.target.value;
  this.page = 1;
  this.getcity(this.page, this.limit);
}



}
