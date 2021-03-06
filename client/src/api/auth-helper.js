import decode from 'jwt-decode';
const auth = {
  isAuthenticated() {

    if (localStorage.jwtToken)
        return (decode(localStorage.jwtToken))
    else
      return false
  },
  authenticate(jwtToken, cb) {
    localStorage.setItem('jwtToken', JSON.stringify(jwtToken))
    console.log(decode(localStorage.jwtToken))
    cb()
  },
  clearJWT() {
    localStorage.removeItem('jwtToken')
  }
}

export default auth