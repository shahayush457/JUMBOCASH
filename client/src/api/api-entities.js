import config from '../config'

const create = async (entity,token) => {
    try {
        
        let response = await fetch(config.server+'/entities', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+JSON.parse(token)
          },
          body: JSON.stringify(entity)
        })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

const read = async (token) => {
  try {
      
      let response = await fetch(config.server+'/entities', {
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
const find = async (url, token) => {
  try {
    console.log(config.server+'/entities/filter?'+url);
    let response = await fetch(config.server+'/entities/filter?'+url, {
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
    read,
    find
}