const fs = require("fs");
const path = require("path");

(function init() {
  const users = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/users.json"), "utf-8"));
  const mobileDevices = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/mobile_devices.json"), "utf-8"));
  const iotDevices = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/iot_devices.json"), "utf-8"));

  console.log(new Date().toISOString());
  console.log(count(users, mobileDevices, iotDevices));
  console.log(new Date().toISOString());
})();

function count(users, mobileDevices, iotDevices) {
  const objIotDevices = iotDevices.reduce((acc,iot) => {
    return acc[iot.mobile] ? acc[iot.mobile]++ : acc[iot.mobile] = 1, acc;
  },{});
  const objIotDevicesMap = new Map(Object.entries(objIotDevices));

  const objMobileDevices = mobileDevices.reduce((acc,mobile) => {
      return acc[mobile.user] ? acc[mobile.user] += objIotDevicesMap.get(mobile.id) : acc[mobile.user] = objIotDevicesMap.get(mobile.id), acc;
  },{});
  const objMobileDevicesMap = new Map(Object.entries(objMobileDevices));

  const objUsers = users.map((user) => {
    return objMobileDevicesMap.has(user.id) ? [user.name, objMobileDevicesMap.get(user.id)] : [user.name, 0];
  });

  return  new Map(objUsers);
}