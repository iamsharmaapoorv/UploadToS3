'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

images = (db) => {
  db.createTable('images', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: 'string',
    description: 'string',
    filetype: 'string',
    height: 'int',
    width: 'int',
    created: 'datetime'  // shorthand notation
  })
}
exports.up = function(db) {
  return images(db);
};

exports.down = function(db) {
  return db.dropTable('images');
};

exports._meta = {
  "version": 1
};
