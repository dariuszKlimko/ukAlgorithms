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
  const  iotDevicesMap = new Map();

  iotDevices.forEach((iot) => {
    if(!iotDevicesMap.has(iot.mobile)){
      iotDevicesMap.set(iot.mobile,0);
    }
    const valueIot = iotDevicesMap.get(iot.mobile);
    iotDevicesMap.set(iot.mobile,valueIot + 1);
  });
  
  // assign owner id (with suffix) to counted iot devices
  const mobileDevicesMap = new Map();

  mobileDevices.forEach((mobile) => {
    if(!mobileDevicesMap.has(mobile.user)){
      mobileDevicesMap.set(mobile.user,iotDevicesMap.get(mobile.id));
    } else{
      const valueMobile = mobileDevicesMap.get(mobile.user);
      mobileDevicesMap.set(mobile.user,valueMobile + iotDevicesMap.get(mobile.id));
    }
  });
 
  // cut suffix of name
  const objUsers = users.map((user) => {
    return {name: user.name.split(' ')[0], count: mobileDevicesMap.get(user.id) ?  mgobileDevicesMap.get(user.id) : 0} ;
  });
  
  // count iot devices per each name
  const iotCountMap = new Map();

  objUsers.forEach((user) => {
    if(!iotCountMap.has(user.name)){
      iotCountMap.set(user.name, user.count)
    }
    else{
      const userValue = iotCountMap.get(user.name);
      iotCountMap.set(user.name, userValue + user.count);
    }
  })
  console.log("hello from feature-console");
  
  return iotCountMap;
}