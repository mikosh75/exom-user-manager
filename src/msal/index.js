import * as Msal from "msal";
import config from "../config";
// With a lot of help from ; https://stackoverflow.com/questions/52944052/creating-a-single-instance-of-a-class-within-a-vue-application
// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core/src/UserAgentApplication.ts

export default class AuthService {
  constructor() {
    // let redirectUri = window.location.origin;
    let redirectUri =
      process.env.NODE_ENV === "production"
        ? config.redirecturlprod
        : config.redirecturl;
    let PostLogoutRedirectUri = "/";
    this.graphUrl = config.graphendpoint;
    this.graphUrlInvitation = config.graphendpointinvitation;
    this.graphUrlAddUserToGroup = config.graphendpointaddusertogroup;
    this.graphUrlUpdateUser = config.graphendpointupdateuser;
    this.applicationConfig = {
      clientID: config.clientid,
      authority: config.authority,
      graphScopes: config.graphscopes
    };
    this.app = new Msal.UserAgentApplication(
      this.applicationConfig.clientID,
      this.applicationConfig.authority,
      () => {
        // callback for login redirect
      },
      {
        redirectUri
      }
    );
  }

  // Core Functionality
  loginPopup() {
    return this.app.loginPopup(this.applicationConfig.graphScopes).then(
      idToken => {
        const user = this.app.getUser();
        if (user) {
          return user;
        } else {
          return null;
        }
      },
      () => {
        return null;
      }
    );
  }

  loginRedirect() {
    this.app.loginRedirect(this.applicationConfig.graphScopes);
  }

  logout() {
    this.app._user = null;
    this.app.logout();
  }

  // Graph Related
  getGraphToken() {
    return this.app.acquireTokenSilent(this.applicationConfig.graphScopes).then(
      accessToken => {
        return accessToken;
      },
      error => {
        return this.app
          .acquireTokenPopup(this.applicationConfig.graphScopes)
          .then(
            accessToken => {
              return accessToken;
            },
            err => {
              console.error(err);
            }
          );
      }
    );
  }

  getGraphUserInfo(token) {
    const headers = new Headers({
      Authorization: `Bearer ${token}`
    });
    const options = {
      headers
    };
    return fetch(`${this.graphUrl}`, options)
      .then(response => response.json())
      .catch(response => {
        throw new Error(response.text());
      });
  }

  async createGraphInvitation(token, requestBody) {
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json"
    });
    const options = {
      headers,
      method: "POST",
      body: requestBody
    };
    try {
      const response = await fetch(`${this.graphUrlInvitation}`, options);
      return await response.json();
    } catch (response_1) {
      throw new Error(response_1.text());
    }
  }

  async addUserToGroup(token, requestBody) {
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json"
    });
    const options = {
      headers,
      method: "POST",
      body: requestBody
    };
    try {
      const response = await fetch(`${this.graphUrlAddUserToGroup}`, options);
      if (response.status != 204) return await response.json();
    } catch (response_1) {
      throw new Error(response_1.json());
    }
  }

  async updateUser(token, user, requestBody) {
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json"
    });
    const options = {
      headers,
      method: "PATCH",
      body: requestBody
    };
    try {
      const response = await fetch(
        `${this.graphUrlUpdateUser}/${user}`,
        options
      );
      if (response.status != 204) return await response.json();
    } catch (response_1) {
      throw new Error(response_1.json());
    }
  }

  // Utility
  getUser() {
    return this.app.getUser();
  }
}
