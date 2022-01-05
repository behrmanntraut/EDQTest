"use strict";
exports.__esModule = true;
exports.NamePart = exports.OdometerUnits = exports.OdometerStatus = exports.VehicleStatus = exports.VehicleInterest = exports.ProspectStatus = void 0;
var ProspectStatus;
(function (ProspectStatus) {
    ProspectStatus["new"] = "new";
    ProspectStatus["resend"] = "resend";
})(ProspectStatus = exports.ProspectStatus || (exports.ProspectStatus = {}));
var VehicleInterest;
(function (VehicleInterest) {
    VehicleInterest["buy"] = "buy";
    VehicleInterest["lease"] = "lease";
    VehicleInterest["sell"] = "sell";
    VehicleInterest["tradeIn"] = "trade-in";
    VehicleInterest["testDrive"] = "test-drive";
})(VehicleInterest = exports.VehicleInterest || (exports.VehicleInterest = {}));
var VehicleStatus;
(function (VehicleStatus) {
    VehicleStatus["new"] = "new";
    VehicleStatus["used"] = "used";
})(VehicleStatus = exports.VehicleStatus || (exports.VehicleStatus = {}));
var OdometerStatus;
(function (OdometerStatus) {
    OdometerStatus["unknown"] = "unknown";
    OdometerStatus["rolledover"] = "rolledover";
})(OdometerStatus = exports.OdometerStatus || (exports.OdometerStatus = {}));
var OdometerUnits;
(function (OdometerUnits) {
    OdometerUnits["km"] = "km";
    OdometerUnits["mi"] = "mi";
})(OdometerUnits = exports.OdometerUnits || (exports.OdometerUnits = {}));
var NamePart;
(function (NamePart) {
    NamePart["full"] = "full";
})(NamePart = exports.NamePart || (exports.NamePart = {}));
