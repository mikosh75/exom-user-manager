export default class isAuthenticated {
  constructor() {
    // let redirectUri = window.location.origin;
    let redirectUri =
      process.env.NODE_ENV === "production" ?
      "redirecturlprod" :
      "redirecturldev";
    this.apiUrl = "https://yesno.wtf/api";
  }

  foo() {
    console.log('foo')
  }

  bar() {
    console.log('bar')
  }

  baz() {
    console.log('baz')
  }

  async check() {
    /* const headers = new Headers({
      Authorization: `Bearer ${token}`
    });
    const options = {
      headers
    }; */
    try {
      const response = await fetch(`${this.apiUrl}`);
      return await response.json();
    } catch (response_1) {
      throw new Error(response_1.text());
    }
  }
}