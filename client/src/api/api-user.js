const read = async (token) => {
    try {
      let response = await fetch('http://localhost:8081/api/v1/auth/user' , {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + JSON.parse(token),
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

export {
    read
}