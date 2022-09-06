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
  // count iot devices with same mobile device id
  const objIotDevices = iotDevices.reduce((acc,iot) => {
    return acc[iot.mobile] ? acc[iot.mobile]++ : acc[iot.mobile] = 1, acc;
  },{});
  // create Map object to keep O(n)
  const objIotDevicesMap = new Map(Object.entries(objIotDevices));
  
  // assign owner id (with suffix) to counted iot devices
  const objMobileDevices = mobileDevices.reduce((acc,mobile) => {
      return acc[mobile.user] ? acc[mobile.user] += objIotDevicesMap.get(mobile.id) : acc[mobile.user] = objIotDevicesMap.get(mobile.id), acc;
  },{});
  // create Map object to keep O(n)
  const objMobileDevicesMap = new Map(Object.entries(objMobileDevices));
 
  // cut suffix of name
  const objUsers = users.map((user) => {
    return {name: user.name.split(' ')[0], count: objMobileDevicesMap.get(user.id) ?  objMobileDevicesMap.get(user.id) : 0} ;
  });
  
  // count iot devices per each name
  const iotCount = objUsers.reduce((acc,user) => {
    return acc[user.name] ? acc[user.name] += user.count : acc[user.name] = user.count, acc;
  },{});

  return  new Map(Object.entries(iotCount));
}