export enum ProspectStatus {
  new = 'new',
  resend = 'resend'
}

export enum VehicleInterest {
  buy = 'buy',
  lease = 'lease',
  sell = 'sell',
  tradeIn = 'trade-in',
  testDrive = 'test-drive'
}

export enum VehicleStatus {
  new = 'new',
  used = 'used'
}

export enum OdometerStatus {
  unknown = 'unknown',
  rolledover = 'rolledover'
}

export enum OdometerUnits {
  km = 'km',
  mi = 'mi'
}

export interface Odometer {
  value: string;
  status: string;
  units: string;
  unit: string;
}

export interface Vehicle {
  // Attributes
  interest: string;
  status: string;

  // Data
  //   id: string;
  year: string;
  make: string;
  model: string;
  vin: string;
  stock: string;
  Stock: string;
  trim: string;
  category: string;
  type: string;
  class: string;
  value: string;
  doors: string;
  bodystyle: string;
  transmission: string;
  condition: string;
  price: Price[];
  // pricecomments: string;
  comments: string;
  // attlist + elements
  odometer: Odometer[];
  mileage: string;
  colorcombination: Colorcombination;
  //   imagetag: string;
  //   option: string;
  id: Id[];
  date: Date;
  option: Option[];
  finance: Finance;
}
export interface Colorcombination {
  exteriorcolor: string;
  interiorcolor: string;
  preference: string;
}

export interface Option {
  optionname: string;
  manufacturecode: string;
  manufacturercode: string;
}

export interface FinanceAmount {
  value: string;
  type: string;
  currency: string;
}

export interface Price {
  value: string;
  type: string;
  currency: string;
  source: string;
}

export interface Finance {
  method: string;
  amount: FinanceAmount[];
  balance: FinanceAmount[];
}

export interface Id {
  value: string;
  sequence: string;
  source: string;
  SourceName: string;
}

export enum NamePart {
  full = 'full'
}

export interface Name {
  value: string;
  sequence: string;
  part: string;
  type: string;
  params: string;
}

export interface Street {
  value: string;
  line: string;
}

export interface Email {
  value: string;
  preferredcontact: string;
}

export interface Phone {
  value: string;
  type: string;
  params: string;
  time: string;
  preferredcontact: string;
}

export interface Address {
  street: Street[];
  city: string;
  regioncode: string;
  type: string;
  state: string;
  postalcode: string;
  zip: string;
  country: string;
  url: string;
  apartment: string;
}

export interface Contact {
  name: Name[];
  phone: Phone[];
  email: Email[];
  address: Address;
  primarycontact: string;
  preferredcontact: string;
  newsletteroptin: string;
  Suffix: string;
  DOB: string;
  date_of_birth: string;
  city: string;
  state: string;
  postalcode: string;
}
export interface Vendorname {
  value: string;
  part: string;
}

export interface Vendor {
  id: Id[];
  contact: Contact[];
  url: string;
  vendorname: Vendorname[];
}

export interface Provider {
  name: Name[];
  service: string;
  url: string;
  email: Email[];
  dealix: string;
  form: string;
  leadtype: string;
  id: Id[];
  source: string;
  phone: Phone[];
  contact: Contact[];
}

export interface Timeframe {
  description: string;
  earliestdate: string;
  latestdate: string;
}

export interface Customer {
  comments: string;
  contact: Contact[];
  timeframe: Timeframe;
  language: string;
  id: Id[];
  // Null for now
  Residence: string;
  Employment: string;
  Reference: string;
  DriversLicenseInformation: string;
}
export interface Leadbase {
  requestdate: Date;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dealer: string;
  leadSource: string;
}

export interface employment {
  Type: String;
  EmployerName: String;
  Occupation: String;
  Period: String;
  phone: Phone[];
  MonthlySalary: number;
  OtherIncome: number;
}

export interface Prospect {
  status: ProspectStatus;
  id: Id[];
  leadtype: string;
  requestdate: Date;
  vehicle: Vehicle[];
  customer: Customer;
  vendor: Vendor;
  provider: Provider;
  QkAppRefKey: string;
  comments: string;
  SalesAgent: string;
  Notes: string;
  finance: Finance;
  leadBase: Leadbase;
  // Null for now
  Residence: string;
  Employment: employment;
  Reference: string;
  DriversLicenseInformation: string;
}

export interface Adf {
  processed: number;
  prospect: Prospect;
}
