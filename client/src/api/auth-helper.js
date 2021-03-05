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
  clearJWT(cb) {
    localStorage.removeItem('jwtToken')
    cb()
  }
}

export default auth