import Constants from 'expo-constants';
import useStore from '../store'

const apiUrl = Constants.expoConfig.extra.apiUrl

const createUser = (name) => {
  const requestOptions = {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      "user": { 
        "name": name
      }
    })
  }
  
  fetch(`${apiUrl}/users`, requestOptions)
  .then(response => {
    let setCookie = response.headers['map']['set-cookie']
    useStore.setState({cookie: setCookie})
  })
}


export { createUser }