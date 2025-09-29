import { SettingService } from "./../../Service/setting.service";
import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/Service/auth.service";
import { CityService } from "src/app/Service/city.service";
import { CreaterideService } from "src/app/Service/createride.service";
import { SuccessDialogComponent } from "src/app/shared/success-dialog/success-dialog.component";

declare var google: any;

@Component({
  selector: "app-createride",
  templateUrl: "./createride.component.html",
  styleUrls: ["./createride.component.css"],
})
export class CreaterideComponent {
  @ViewChild("startInput") startInput: ElementRef | undefined;
  @ViewChild("waypointInput") waypointInput: any;
  @ViewChild("endInput") endInput: ElementRef | undefined;
  @ViewChild("directionBtn") directionBtn: any;
  countryCodes: any = [];
  map: any;
  directionsService: any;
  directionsRenderer: any;
  waypointsArray: any = [];
  userArray: any;
  cities: any =[];
  cordinatesArray: any = [];
  polygon: any;
  isInZone: boolean = true;
  polygonsArray: any = [];
  polygonObjects: any = [];
  cityIndex: any;
  isRoute: any = false;
  vehiclesPricing: any = [];
  totalDistance: any;
  totalTime: any;
  estimateFare: any;

  userForm = this.fb.group({
    countrycode: ["+91", Validators.required],
    userphone: [
      "",
      [
        Validators.required,
        Validators.pattern("[0-9]*"),
        Validators.minLength(10),
      ],
    ],
  });

  travelForm = this.fb.group({
    start: ["", Validators.required],
    end: ["", Validators.required],
  });

  rideForm = this.fb.group({
    serviceType: ["", Validators.required],
    paymentOption: ["", Validators.required],
    rideTime: ["", Validators.required],
  });

  numericInputValue: any = "";
  isNext = true;  // to Show NEXT button
  isUser = false; // to Hide USER Details FORM
  selectedVehicle: any;
  stops: any;
  stopsCounter: any = 0;
  selectedOption: string = "";
  selectedDate: any;
  selectedTime: any;
  minDate: any;
  minTime: any;
  startLocation: any;
  endLocation: any;
  rideData: any;
  totalHours: any;
  totalMinutes: any;
  estimateTime: string = "";
  page: number = 1
  limit: number =500
  isDateTimeValid: boolean = true;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private _createride: CreaterideService,
    private toaster: ToastrService,
    private _city: CityService,
    private cdr: ChangeDetectorRef,
    private _setting: SettingService,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const currentDate = new Date();
    this.selectedDate = this.formatDate(currentDate);
    this.selectedTime = this.formatTime(currentDate);
    this.getcountryCode();
    this.getNumberOfStops();
    this.initMap();
    this.initializeAutoComplete();
  }

     

  drawRoute(response: any): void {

  const route = response.routes[0];

  let totalDistance = 0;
  let totalDuration = 0;

  for (let leg of route.legs) {
    totalDistance += leg.distance.value; // meters
    totalDuration += leg.duration.value; // seconds
  }

  this.totalDistance = totalDistance / 1000; // km
  this.totalTime = totalDuration / 60; // mins
  this.totalHours = Math.floor(totalDuration / 3600);
  this.totalMinutes = Math.floor((totalDuration % 3600) / 60);
  this.estimateTime = `${this.totalHours} hr ${this.totalMinutes} min`;

  console.log("Distance:", this.totalDistance, "km");
  console.log("Estimated Time:", this.estimateTime);

  if (this.directionsRenderer) {
    this.directionsRenderer.setDirections(response);
  }
  if (this.vehiclesPricing.length > 0) {
  this.vehiclesPricing.forEach((vehiclePricing: any, i: number) => {
    this.calculateFare(vehiclePricing, i);
  });
}
}



    //  Autocomplete


    initializeAutoComplete() {
  const startAutocomplete = new google.maps.places.Autocomplete(this.startInput?.nativeElement);
  startAutocomplete.addListener("place_changed", () => {
    const place = startAutocomplete.getPlace();
    this.startLocation = place.formatted_address;

    const extractedCity = this.extractCityFromPlace(place);
    this.cityIndex = this.cities.findIndex((c: any) =>
      c.city.toLowerCase() === extractedCity.toLowerCase()
    );

    console.log("START CITY:", extractedCity);
    console.log("Matched City Index:", this.cityIndex);

    if (this.cityIndex === -1) {
      this.toaster.error("No matching city found in database for pricing.");
    }
  });

  const endAutocomplete = new google.maps.places.Autocomplete(this.endInput?.nativeElement);
  endAutocomplete.addListener("place_changed", () => {
    const place = endAutocomplete.getPlace();
    this.endLocation = place.formatted_address;

    const extractedCity = this.extractCityFromPlace(place);
    console.log("DESTINATION CITY:", extractedCity);
  });
}



  // -------------------------------------INITIALIZE GOOGLE MAP-------------------------------------//
 initMap() {
  navigator.geolocation.getCurrentPosition((location) => {
    let result = location.coords;
    const place = { lat: result.latitude, lng: result.longitude };

    // Initialize the map
    this.map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 7,
        center: place,
      }
    );

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);

    // AUTOCOMPLETE for Start Input
    const startAutocomplete = new google.maps.places.Autocomplete(this.startInput?.nativeElement);
    startAutocomplete.addListener("place_changed", () => {
      const place = startAutocomplete.getPlace();
      this.startLocation = place.formatted_address;

      const cityName = this.extractCityFromPlace(place);
      console.log("Extracted city name from start location:", cityName);

      this.cityIndex = this.cities.findIndex(
        (city: any) => city.city.toLowerCase() === cityName.toLowerCase()
      );
      console.log("CITY Index Value=========", this.cityIndex);

      if (this.cityIndex === -1 || this.cityIndex === undefined) {
        this.toaster.error("No matching city found in database for pricing.");
      }
    });

    // (Optional) Do the same for endInput if needed
  });
}
// Add this method inside your component
extractCityFromPlace(place: any): string {
  const cityComponent = place.address_components?.find((component: any) =>
    component.types.includes("locality") ||
    component.types.includes("administrative_area_level_2")
  );
  return cityComponent?.long_name || "";
}


  //--------------------COUNTRY CODES REST API--------------------
  getCodes() {
    this.http.get("https://restcountries.com/v3.1/all").subscribe({
      next: (countries: any) => {
        countries.forEach((response: any) => {
          if (response.idd.suffixes) {
            let code = response.idd.root + response.idd.suffixes[0];
            this.countryCodes.push(code);
          }
        });
        this.countryCodes.sort();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  getcountryCode(){
    this._createride.getcode().subscribe({
      next: (response) => {
        // console.log(response)
        let code = response.countrydata.forEach((element: any) => {
          // console.log(element.countryCode)
          this.countryCodes.push(element.countryCode)
        });
        this.countryCodes.sort();
        // console.log(this.countrycode)
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  //--------------- TO GET NO. OF STOPS ------------------
  getNumberOfStops() {
    this._setting.get_setting_data().subscribe({
      next: (response: any) => {
        // console.log(response);
        this.stops = response[0].stop;
        // console.log(this.stops);
      },
      error: (error: any) => {
        this.toaster.error(error.message);
      },
    });
  }

  // ------------------PHONE NUMBER FILTER---------------------
  filterPhone(event: any) {
    let inputValue: string = event.target.value;
    inputValue = inputValue.replace(/\D/g, "");
  
    if (inputValue.length > 10) {
      inputValue = inputValue.slice(0, 10);
    }
  
    this.userForm.patchValue({
      userphone: inputValue
    });
  
    event.target.value = inputValue;
  }

  // ----------------------------------------GET USER DETAILS----------------------------------------//
  getUserDetails() {
    this.isNext = true;
    const userData = {
      countrycode: this.userForm.value.countrycode,
      userphone: this.userForm.value.userphone,
    };

    this._createride.getUserByNumber(userData).subscribe({
      next: (userResponse: any) => {
        console.log(userResponse)
        this.userArray = userResponse
        this.isUser = true;
        this.polygonsArray = [];  // to clear the polygon array

        this._city.getcity(this.page, this.limit).subscribe({
          next: (resp: any) => {
            console.log("This is Available Cities in DB for Service============",resp);

            this.cities = resp.citydata;

            this.cities.forEach((city: any) => {
              this.polygonsArray.push(city.coordinates);
            });
            console.log("City's Polygons data:  ",this.polygonsArray);


            this.polygonObjects = this.polygonsArray.map(function (polygonCoordinates: any) {
              return new google.maps.Polygon({
                paths: polygonCoordinates,
              });
            });
          },
          error: (error: any) => {
            console.log(error);
            this.toaster.error(error.status, error.message);
          },
        });
      },
      error: (error: any) => {
        console.log(error.error.message);
        if (error.error) {
          this.toaster.error(error.error.message, "Sorry");
          this.userArray = undefined;
          this.isUser = false;
        } else {
          this.toaster.error(error.status, error.statusText);
        }
      },
    });
  }

  // ----------------------------------------AFTER USER FOUND----------------------------------------//
  addTravelForm() {
    this.isNext = false;  // to hide NEXT button
    this.isUser = false;  // to hide USER form

    setTimeout(() => {
      console.log("Autocomplete Function Initiated====================Now");
      this.initAutocomplete();
    }, 200);
  }

  // --------------------AUTO COMPLETE FUNCTION IN TRAVEL FORM-------------------
  initAutocomplete() {
    let start = document.getElementById("startInput") as HTMLInputElement;
    const startAutocomplete = new google.maps.places.Autocomplete(start);
    console.log(startAutocomplete);
    
    let waypoints = document.getElementById("waypoint") as HTMLInputElement;

    const waypointsAutocomplete = new google.maps.places.Autocomplete(waypoints);
    let end = document.getElementById("endInput") as HTMLInputElement;
    const endAutocomplete = new google.maps.places.Autocomplete(end);
  }

  //-------------when starting location change-------------------
  startInputChange() {
    this.rideForm.reset();
    this.rideForm.patchValue({
      serviceType: "",
    });
    this.startLocation = this.startInput?.nativeElement.value;
    this.isInZone = true;
    if (this.startLocation != "") {
      this.checkMyLocation();
      setTimeout(() => {
        if (this.cityIndex !== undefined) {
          this.getVehiclePricing(this.cityIndex);
        }
      }, 500); // ✅ Fixed capitalization
    }
  }

  //--------------TO CHECK START LOCATION IS AVAILABLE IN ZONE OR NOT----------------//
 checkMyLocation() {
    if (this.polygonObjects?.length !== 0) {
      const geocoder = new google.maps.Geocoder();
      console.log("📍 Geocoder initialized:", geocoder);

      setTimeout(() => {
        let input = document.getElementById("startInput") as HTMLInputElement;
        console.log("📍 Start input value:", input.value);

        geocoder.geocode({ address: input.value }, (results: any, status: any) => {
          if (status === "OK") {
            const location = results[0].geometry.location;
            console.log("📍 Geocoded location:", location);

            this.isInZone = false;
            this.cityIndex = undefined;

            // ✅ Fallback: match city by name if no polygon match
            const inputCityMatch = this.cities.find((city: any) =>
              input.value.toLowerCase().includes(city.city.toLowerCase())
            );
            if (inputCityMatch) {
              this.cityIndex = this.cities.indexOf(inputCityMatch);
              this.isInZone = true;
              console.warn("⚠️ No polygon match, but city matched by name. Using fallback city:", inputCityMatch.city);
            }

            if (this.polygonObjects.length === 0) {
              console.warn("⚠️ No polygons defined. Allowing ride by default.");
              this.isInZone = true;
            } else {
              for (let i = 0; i < this.polygonObjects.length; i++) {
                if (
                  google.maps.geometry.poly.containsLocation(
                    location,
                    this.polygonObjects[i]
                  )
                ) {
                  this.cityIndex = i;
                  console.log("✅ Location is inside polygon index:", this.cityIndex);
                  this.isInZone = true;
                  break;
                }
              }
            }

            console.log("✅ Is user inside any zone:", this.isInZone);
            console.log("🔢 City Index after loop:", this.cityIndex);

            if (!this.isInZone) {
              console.warn("❌ Service Not Available in this zone.");
              if (this.endInput) {
                this.endInput.nativeElement.disabled = true;
                this.waypointInput.nativeElement.disabled = true;
                this.directionBtn.nativeElement.disabled = true;
              }
              this.toaster.error("Service is Not Available in this City");
            } else {
              if (this.endInput) {
                this.endInput.nativeElement.disabled = false;
                this.waypointInput.nativeElement.disabled = false;
                this.directionBtn.nativeElement.disabled = false;
              }
              console.log("✅ Service Available in selected location.");
              this.toaster.success("Service is Available in City");
            }
          } else {
            console.error("❌ Google Geocode failed. Did user select from auto-suggestion? Status:", status);
            this.toaster.info("Please select a location from auto-suggestion");
          }
        });
      }, 200);
    } else {
      console.warn("⚠️ Polygon data not loaded. Skipping location check.");
      // Optional fallback to allow ride
      if (this.endInput) {
        this.endInput.nativeElement.disabled = false;
        this.waypointInput.nativeElement.disabled = false;
        this.directionBtn.nativeElement.disabled = false;
      }
      this.toaster.success("Service Available by default (no zone polygons loaded)");
    }
  }


  // ----------------------ADD WAY POINTS----------------------
  addWaypoint() {
    const waypoint = this.waypointInput?.nativeElement.value;
    if (waypoint) {
      this.stopsCounter++;
      this.waypointsArray.push(waypoint);
      this.waypointInput.nativeElement.value = ""; // Clear the input field
    }
  }

  // ----------------------REMOVE WAY POINTS----------------------
  removeWaypoint(index: number) {
    this.stopsCounter--;
    this.waypointsArray.splice(index, 1);
  }

  // To get direction
  calculateRoute() {
    this.startLocation = this.startInput?.nativeElement.value;
    this.endLocation = this.endInput?.nativeElement.value;
    this.rideForm.reset();
    this.rideForm.patchValue({
      serviceType: "",
    });
     
    console.log("STARTING LOCATION:   ",this.startLocation);
    console.log("DESTINATION LOCATION:   ",this.endLocation);

    console.log("MY WAY POINT ARRAY===================",this.waypointsArray);
      console.log('vehiclesPricing:', this.vehiclesPricing); //te
    this.directionsService?.route(
      {
        origin: this.startLocation,
        destination: this.endLocation,
        waypoints: this.waypointsArray.map((waypoint: any) => ({
          location: waypoint,
        })),
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response: any, status: string) => {
        if (status === "OK") {
          this.drawRoute(response);
          // console.log(this.travelForm.value);
          this.isRoute = true;
        } else {
          if (status === "ZERO_RESULTS") {
            this.isRoute = false;
            alert("No route found for given locations!");
            console.log("No route found for given locations! " + status)
          } else {
            this.isRoute = false;
            alert("Select location from auto suggestion ");
            console.log("Select location from auto suggestion " + status)
          }
        }
      }
    );
  }

  //-------------------------CALCULATE FARE----------------------------//
  calculateFare(vehiclePricing: any, cityIndex: any) {
  const minFare = Number(vehiclePricing.minfare) || 0;
  const baseDistance = Number(vehiclePricing.distancebaseprice) || 0;
  const basePrice = Number(vehiclePricing.baseprice) || 0;
  const ppudist = Number(vehiclePricing.ppudist) || 0;
  const pputime = Number(vehiclePricing.pputime) || 0;

  const totalDistance = Number(this.totalDistance) || 0;
  const totalTime = Number(this.totalTime) || 0;

 let estimatePrice = ((totalDistance - baseDistance) * ppudist) + basePrice + (totalTime * pputime);


  console.log("➡️ Raw distance:", totalDistance);
console.log("➡️ Base distance:", baseDistance);
console.log("➡️ Raw time (min):", totalTime);
console.log("➡️ Per km rate:", ppudist);
console.log("➡️ Per min rate:", pputime);
console.log("➡️ Base price:", basePrice);
console.log("➡️ Min fare:", minFare);
console.log("➡️ Calculated estimate:", estimatePrice);

 
  if (isNaN(estimatePrice) || estimatePrice < minFare || estimatePrice < basePrice) {
    estimatePrice = minFare;
  }

  estimatePrice = Math.round(estimatePrice); // Optional: round off to nearest integer

  this.estimateFare = estimatePrice;
  this.vehiclesPricing[cityIndex].estimateFare = estimatePrice;

  console.log("✅ Estimated Fare:", estimatePrice);
}


  //----------------------GET VEHICLE PRICING----------------------//
 getVehiclePricing(index: any) {
  console.log("CITY Index Value=========", index);

  const city = this.cities[index];

  if (!city || !city._id) {
    this.toaster.error("City data is invalid or missing.");
    this.vehiclesPricing = [];
    return;
  }

  const cityId = city._id;
  const cityName = city.city;

  console.log("CITY ID========", cityId);
  console.log("CITY NAME========", cityName);

  this._createride.getServiceType(cityId).subscribe({
    next: (res: any) => {
      this.vehiclesPricing = res?.pricingdata || [];

      if (this.vehiclesPricing.length === 0) {
        this.toaster.warning("No service types available for this city.");
      }

      // Recalculate fare for each type
      this.vehiclesPricing.forEach((vehiclePricing: any, i: number) => {
        this.calculateFare(vehiclePricing, i);
      });

      this.cdr.detectChanges();
      console.log("Estimated Price Array==================", this.vehiclesPricing);
    },
    error: (err: any) => {
      console.log("Error fetching pricing data:", err);
      this.toaster.error(err.message || "Failed to fetch service types.");
      this.vehiclesPricing = [];
    },
  });

    //----------------CLEAR PREVIOUS ROUTE and DRAW NEW------------------//
    this.directionsRenderer.setMap(null);
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: "blue",
        strokeWeight: 5,
      }
    });
    this.directionsRenderer.setMap(this.map);

    //-----------------DISPLAY NEW ROUTE-----------------------//
    this.directionsRenderer.setDirections(Response);
  }

  //-------------------------------SELECT SERVICE TYPE---------------------------------------------//
  onSelectServiceType(serviceType: any) {
    console.log(serviceType);
    //It is returning condition value True or False, If selected vehicle is same as serviceType
    this.selectedVehicle = this.vehiclesPricing.find((price: any) => {
      console.log(price.service.vehicleName === serviceType)
      return price.service.vehicleName === serviceType;
    });
    console.log("Selected Vehicle Condition Value===========", this.selectedVehicle);
    
    if (this.selectedVehicle) {
      this.selectedVehicle.totalDistance = this.totalDistance;
      this.selectedVehicle.totalTime = this.totalTime;
    }
    // console.log(this.selectedVehicle);
    // console.log(this.selectedVehicle.totalDistance);
    // console.log(this.selectedVehicle.totalTime);
    
  }

  //---------------------------------SELECT DATE AND TIME------------------------------------------//
  handleRadioChange() {
    // console.log("RADION BUTTON CLICKED=================");
    if (this.selectedOption === "bookNow") {
      const currentDate = new Date();
      this.selectedDate = this.formatDate(currentDate);
      this.selectedTime = this.formatTime(currentDate);
      this.isDateTimeValid = true;
    } else {
      const currentDate = new Date();
      this.minDate = this.formatDate(currentDate);
      this.minTime = this.formatTime(currentDate);

      const selectedDateTime = new Date(
        this.selectedDate + "T" + this.selectedTime
      );
      const currentDateTime = new Date();

      //------------REFRESH DATE AND TIME WHEN SELECTING--------------//
      if (selectedDateTime < currentDateTime) {
        // console.log(selectedDateTime < currentDateTime);

        setTimeout(() => {
          this.selectedDate = this.formatDate(currentDateTime);
          this.selectedTime = this.formatTime(currentDateTime);
        }, 0);

        this.isDateTimeValid = false;
      }
      this.isDateTimeValid = selectedDateTime > currentDateTime;
      if(!this.isDateTimeValid){
        this.toaster.info("Please select valid date and time");
      }
      console.log("isDateTimeValid=============", this.isDateTimeValid)
      // ------------------------------------------------------------------------------------------------------------------------------------------------//
    }
  }

  onselecteddate() {
    console.log(this.selectedDate);
    console.log("SELECTED DATE==================",this.selectedDate);
    this.handleRadioChange()
  }
  onselectedtime() {
    console.log("SELECTED TIME==================",this.selectedTime);
    this.handleRadioChange()
  }

  // ------------------------------------FORMAT DATE AND TIME----------------------------------------//
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  formatTime(date: Date): string {
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  }

  // -------------------------------------------------TO BOOK RIDE------------------------------------------------------//
onBookRide() {
  console.log(this.rideForm.value);
  this.selectedVehicle.startLocation = this.startLocation;
  this.selectedVehicle.endLocation = this.endLocation;
  this.selectedVehicle.waypints = this.waypointsArray;

  this.rideData = {
  ...this.rideForm.value,
  rideDate: this.selectedDate,
  time: this.selectedTime,
  serviceId: this.selectedVehicle.service._id,
  userId: this.userArray._id,
  cityId: this.selectedVehicle.city,
  startLocation: this.startLocation,
  endLocation: this.endLocation,
  wayPoints: this.waypointsArray,
  totalDistance: this.totalDistance,
  totalTime: this.totalTime,
  estimateTime: this.estimateTime,
  estimateFare: this.selectedVehicle.estimateFare,
  status: "confirmed",       // ✅
  ridestatus: 3              // ✅ required to show as confirmed
};

console.log("🚀 Final Ride Data:", this.rideData); // ✅ check in console


  console.log(this.rideData);

  this._createride.addRide(this.rideData).subscribe({
    next: (response) => {
      console.log(response);

      this.toaster.success("Ride booked successfully!");

      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        width: "600px",
        data: { title: "Ride Booked", content: "Ride booked successfully!" },
      });

      this.rideForm.reset();
      this.rideForm.patchValue({
        serviceType: "",
      });
      this.userForm.reset();
      this.userForm.patchValue({
        countrycode: '+91',
      });
      this.travelForm.reset();
      this.isNext = true;
      this.isRoute = false;
      this.directionsRenderer.setMap(null);
      this.removeWaypoint(0);
    },
    error: (error) => {
      console.log(error);
      this.toaster.error(error.message);
    },
  });
}


  // ------------------------------------EXTRA FUNCTIONALITIES CODE---------------------------------------------//

  close(){
    this.isNext = true;
    this.isRoute = false;
    this.directionsRenderer.setMap(null);
    this.travelForm.reset();
    this.removeWaypoint(5)
  }
  resetTimer() {
    this.authService.resetInactivityTimer();
  }
}
