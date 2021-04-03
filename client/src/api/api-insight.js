import config from "../config";

const read = async (token) => {
    try {
      //console.log(config.server+'/transactions/filter?'+url)
      let response = await fetch(config.server + "/insights", {
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

export {read}