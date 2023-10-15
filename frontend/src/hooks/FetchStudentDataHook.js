import storage from "../storage";

const FetchStudentDataHook = async ({URL, payload}) => {
    const getCurrentUserState = (await storage.getAllDataForKey('currentUser'))[0]    
    return fetch(`${URL}/${getCurrentUserState.user.id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCurrentUserState?.authToken}`,
          'Cookie': getCurrentUserState?.refreshToken
        }
    })
      .then(async response => ({body: await response.json(), header: response.headers}))
      .catch(error => {
        console.error({error});
      })
}

export default FetchStudentDataHook