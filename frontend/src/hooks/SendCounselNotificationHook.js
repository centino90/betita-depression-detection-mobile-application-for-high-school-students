import storage from "../storage";

const SendCounselNotificationHook = async ({URL, payload}) => {
    const getCurrentUserState = (await storage.getAllDataForKey('currentUser'))[0]
    return fetch(URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCurrentUserState?.authToken}`,
          'Cookie': getCurrentUserState?.refreshToken          
        },
        body: JSON.stringify(payload)
    })
      .then(async response => ({body: await response.json(), header: response.headers}))
      .catch(error => {
        console.error({error});
      })
}

export default SendCounselNotificationHook