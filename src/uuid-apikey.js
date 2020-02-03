uuidApikey = require('uuid-apikey')

const apiKey = {
  getNewPair: () => {
    return uuidApikey.create()
  },
  checkUUID: uuid => {
    return uuidApikey.isUUID(uuid)
  },
  checkApiKey: apikey => {
    return uuidApikey.isAPIKey(apiKey)
  },
  uuidToApiKey: (uuid, nodashes = false) => {
    return uuidApikey.toAPIKey(uuid,nodashes)
  },
  apiKeyToUUID: apiKey => {
    return uuidApikey.toUUID(apiKey)
  },
  checkPair: (apiKey,uuid) => {   
    return uuidApikey.check(apiKey,uuid)
  }
}

module.exports = apiKey

