import * as types from "../GraphQLTypes";

function fetchCurrentUser(context) {
  return context.rootValue.api.resource('users').read('_self')
}

function fetchCurrentOrganizations(context) {
  return fetchCurrentUser(context).then((user) => user.related('organizations'))
}

var type = new types.GraphQLObjectType({
  name: 'Api',
  description: 'The query root of the schema',
  fields: () => ({
    token: {
      type: types.GraphQLString,
      resolve: (api) => `${api.client.headers.authorization}`.split(' ')[1]
    },
    url: {
      type: types.GraphQLString
    },
    ratelimit_limit: {
      type: types.GraphQLInt,
      resolve: (api) => {
        return api.client.options('').then(function(response) {
          var limit = response.headers._headers['x-ratelimit-limit'][0]
          return limit == 'Infinity' ? -1 : parseInt(limit)
        })
      }
    },
    ratelimit_remaining: {
      type: types.GraphQLInt,
      resolve: (api) => {
        return api.client.options('').then(function(response) {
          var limit = response.headers._headers['x-ratelimit-remaining'][0]
          return limit == 'Infinity' ? -1 : parseInt(limit)
        })
      }
    },
  })
});


export { type };