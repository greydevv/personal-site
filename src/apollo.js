import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import * as Realm from "realm-web"

async function getAccessToken() {
  const realmApp = new Realm.App(process.env.NEXT_PUBLIC_REALM_APP_ID);
  if (!realmApp.currentUser) {
    await realmApp.logIn(Realm.Credentials.anonymous());
  } else {
    await realmApp.currentUser.refreshCustomData();
  }
  return realmApp.currentUser.accessToken;
}

const client = new ApolloClient({
    link: new HttpLink({
      uri: `https://${process.env.NEXT_PUBLIC_GQL_DOMAIN}/api/client/v2.0/app/${process.env.NEXT_PUBLIC_REALM_APP_ID}/graphql`,
      fetch: async (uri, options) => {
        const accessToken = await getAccessToken();
        options.headers.Authorization = `Bearer ${accessToken}`;
        return fetch(uri, options);
      }
    }),
    cache: new InMemoryCache(),
});

export default client;
