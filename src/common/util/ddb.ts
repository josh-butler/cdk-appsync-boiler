import {DynamoDB} from 'aws-sdk';

const {Table, Entity} = require('dynamodb-toolbox');

const DocumentClient = new DynamoDB.DocumentClient();

const {ENTITY_TABLE} = process.env;

const EntityTable = new Table({
  name: ENTITY_TABLE,
  partitionKey: 'pk',
  sortKey: 'sk',
  indexes: {
    GSI1: {partitionKey: '_et', sortKey: 'sk'},
  },
  DocumentClient,
});

const Device = new Entity({
  name: 'DEVICE',
  attributes: {
    pk: {partitionKey: true},
    sk: {sortKey: true},
    id: {type: 'string'},
    name: {type: 'string'},
  },
  table: EntityTable,
});

export {EntityTable, Device};
