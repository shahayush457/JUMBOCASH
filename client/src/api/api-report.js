import config from "../config";

const readyear = async (token) => {
    try {
      //console.log(config.server+'/transactions/filter?'+url)
      let response = await fetch(config.server + "/reports/currentYear", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + JSON.parse(token)
        }
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
};

const readmonth = async (token) => {
  try {
    //console.log(config.server+'/transactions/filter?'+url)
    let response = await fetch(config.server + "/reports/currentMonth", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(token)
      }
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const readweek = async (token) => {
  try {
    //console.log(config.server+'/transactions/filter?'+url)
    let response = await fetch(config.server + "/reports/currentWeek", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(token)
      }
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};


export {readyear,readmonth,readweek}