
const getRedirectUri = (options) => {
  const pathInit = options.path
  const queryInit = JSON.parse(options.query)
  let query = ''
  let queryArr = []
  for (let key in queryInit) {
    queryArr.push(key + '=' + queryInit[key])
  }
  for (let i = 0; i < queryArr.length; i++) {
    query = '?' + queryArr[0]
    if (i > 0) {
      query += '&' + queryArr[i]
    }
  }
  return pathInit + query
}

module.exports = {
  getRedirectUri: getRedirectUri
}