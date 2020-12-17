import { ItemSource } from './index'
import log from 'electron-log'
//import { MSALAuthenticationProviderOptions } from '@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProviderOptions';
//import { Client } from "@microsoft/microsoft-graph-client"
//import { UserAgentApplication } from "msal"
//import * as qs from 'qs'
//import axios from 'axios'
//import 'isomorphic-fetch'
import { MItem } from '../../common/model/mitem'

export class O365ItemSource extends ItemSource {
  constructor(name, configuration, sourceManager) {
    super(name, configuration, sourceManager)
  }

  _innerLoad(query) {
    log.warn(`"query" paramter not supported (${query})`)
    //const client = createAuthenticatedClient(this.configuration.clientId, this.configuration.clientSecret)
	  //client.api("/me/events").get().then(value => {
    //  log.info('FINALLY IT WORKS: ', value)
    //})

    log.info('LOADING O365 ITEMS')
    const fs = require('fs')
    const content = fs.readFileSync(this.configuration.file, 'utf-8')
    const rawItems = JSON.parse(content)
    const items = []

    rawItems.forEach(ri => {
      items.push(new MItem(
        {
        title: ri.subject,
        start: new Date(ri.start.dateTime).toISOString(),
        end: new Date(ri.end.dateTime).toISOString(),
        allDay: ri.isAllDay,
        sourceId: ri.objectId,
        source: 'O365',
        type: 'event'
      }))
    })
    return items
  }
}


/*
class ClientCredentialAuthenticationProvider {

  constructor(clientId, clientSecret) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  async getAccessToken() {
    const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials"
    }
    log.info('MSGRAPH AUTHENTICATION')
    log.info(body)
    try {
      axios.defaults.headers.post['Content-Type'] =
        'application/x-www-form-urlencoded'
      let response = await axios.post(url, qs.stringify(body))
      if (response.status == 200) {
        return response.data.access_token;
      } else {
        throw new Error("Non 200OK response on obtaining token...")
      }
    } catch (error) {
      throw new Error("Error on obtaining token: " + error)
    }
  }
}

function createAuthenticatedClient(clientId, clientSecret) {
    const clientOptions = {
        defaultVersion: "v1.0",
        debugLogging: false,
        authProvider: new ClientCredentialAuthenticationProvider(clientId, clientSecret)
    }

    const client = Client.initWithMiddleware(clientOptions);

    return client
}
*/
