import {DynamoDB} from 'aws-sdk';

const {Table, Entity} = require('dynamodb-toolbox');

const DocumentClient = new DynamoDB.DocumentClient();

const {ENTITY_TABLE} = process.env;

const EntityTable = new Table({
  name: ENTITY_TABLE,
  partitionKey: 'pk',
  sortKey: 'sk',
  indexes: {
    GSI1: {partitionKey: 'GSI1pk', sortKey: 'GSI1sk'},
  },
  entityField: 'GSI1pk',
  DocumentClient,
});

const Device = new Entity({
  name: 'DEVICE',
  attributes: {
    pk: {partitionKey: true},
    sk: {sortKey: true},
    GSI1sk: {type: 'string'},
    id: {type: 'string'},
    name: {type: 'string'},
  },
  table: EntityTable,
});

const Org = new Entity({
  name: 'Org',
  attributes: {
    pk: {partitionKey: true},
    sk: {sortKey: true},
    GSI1sk: {type: 'string'},
    id: {type: 'string'},
    uid: {type: 'string'},
    name: {type: 'string'},
  },
  table: EntityTable,
});

const User = new Entity({
  name: 'User',
  attributes: {
    pk: {partitionKey: true},
    sk: {sortKey: true},
    GSI1sk: {type: 'string'},
    id: {type: 'string'},
    uid: {type: 'string'},
    pid: {type: 'string'},
    name: {type: 'string'},
  },
  table: EntityTable,
});

export {EntityTable, Device, Org, User};
