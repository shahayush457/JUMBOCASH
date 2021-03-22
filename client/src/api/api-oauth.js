import config from '../config'
const oauthGoogle = async (data) => {
    try {
        let response = await fetch(config.server+'/oauth/google', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"access_token":data})
        })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}
const oauthFacebook = async (data) => {
  try {
      let response = await fetch(config.server+'/oauth/facebook', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"access_token":data})
      })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}
export {
    oauthGoogle,
    oauthFacebook
}