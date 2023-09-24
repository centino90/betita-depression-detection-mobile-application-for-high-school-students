const attemptLogin = async ({URL, payload}) => {
    return fetch(URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
      .then(async response => ({body: await response.json(), header: response.headers}))
      .catch(error => {
        console.error({error});
      })
}

export default attemptLogin