const create = async (entity,token) => {
    try {
        console.log(entity);
        let response = await fetch('http://localhost:8081/api/v1/entities', {
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

export {
    create
}