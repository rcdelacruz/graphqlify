import {nodeDefinitions, fromGlobalId} from 'graphql-relay';
import _ from 'lodash';
import _inflection from 'lodash-inflection';
import api from '../adapters/api_adapter';
_.mixin(_inflection);

var {nodeInterface: slugInterface, nodeField: slugField} = nodeDefinitions(
    (slug) => {
        return api.getType('slug').find(slug);
    },
    (obj) => {
        var singular = _.singularize(obj.__api.data.type);
        var typeFile = `./types/${singular}_type.js`;
        var typeKey  = `${_.camelCase(singular)}Type`;
        return require(typeFile)[typeKey];
    }
);

slugInterface.name = 'Slug';
slugField.name = 'slug';

export {slugInterface, slugField};