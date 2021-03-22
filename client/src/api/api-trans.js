import config from '../config'
const create = async (transaction,token) => {
    try {
        let response = await fetch(config.server+'/transactions', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+JSON.parse(token)
          },
          body: JSON.stringify(transaction)
        })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}
const find = async (url, token) => {
  try {
    //console.log(config.server+'/transactions/filter?'+url)
    let response = await fetch(config.server+'/transactions/filter?'+url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+JSON.parse(token)
      }
    })
    return await response.json()
    } catch(err) {
      console.log(err)
    }
}
export {
    create,
    find
}