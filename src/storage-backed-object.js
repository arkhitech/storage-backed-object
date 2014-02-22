'use strict';

// Stores an object in HTML storage in parts
// A single array for the keys, and separate objects for the values
// Means each can be edited without re-saving the entire object
// So is useful for larger structures.
// Object + keys is is the same instance for the lifetime of the StorageBackedObject
angular.module('storage-backed-object',['angularLocalStorage','angular-lo-dash'])
.factory('StorageBackedObject', function (storage, _) {

  function StorageBackedObject(rootKey, storage) {
    this.rootKey = rootKey;
    this.storage = storage;
    this.keys = storage.get(rootKey) || [];
    this.object = {};
    this.populateObject();
  };

  StorageBackedObject.prototype.getStorageKeyForKey = function(key) {
    return this.rootKey + '---VALUES---' + key;
  };

  StorageBackedObject.prototype.saveKeys = function() {
    this.storage.set(this.rootKey, this.keys);
  };

  StorageBackedObject.prototype.saveItemToStorage = function(key, value) {
    var storageKey = this.getStorageKeyForKey(key);
    if (this.keys.indexOf(key) === -1) {
      this.keys.push(key);
      this.saveKeys();
    }

    // Save properties with _ 
    // Make a copy of the object, and remove all properties starting with '_'
    //if (_.isObject(value)) {
    //  value = _.omit(value, function(objValue, key) {
    //    return (key.charAt(0) == '_');
    //  });
    //};

    this.storage.set(storageKey, value);
  };

  StorageBackedObject.prototype.removeItemFromStorage = function(key) {
    var storageKey = this.getStorageKeyForKey(key);
    this.storage.remove(storageKey);
  };

  StorageBackedObject.prototype.getItemFromStorage = function(key) {
    var storageKey = this.getStorageKeyForKey(key);
    var item = this.storage.get(storageKey);
    return item;
  };

  StorageBackedObject.prototype.populateObject = function() {
    var self = this;
    angular.forEach(self.keys, function(key) {
      var item = self.getItemFromStorage(key);
      self.object[key] = item;
    });
  };

  /* Public Methods */
  StorageBackedObject.prototype.set = function(key, value) {
    this.object[key] = value;
    this.saveItemToStorage(key, value);
    this.saveKeys();
  };

  StorageBackedObject.prototype.remove = function(key) {
    delete this.object[key];
    var index = this.keys.indexOf(key);
    if (index != -1) {
      this.keys.splice(index, 1);
      this.saveKeys();
    }
    this.removeItemFromStorage(key);
  };

  StorageBackedObject.prototype.get = function(key) {
    return this.object[key];
  };
  StorageBackedObject.prototype.getMany = function(keys) {
    var values = {};
    var self = this;
    _.each(keys, function(key) {
      values[key] = self.get(key);
    })
    return values;
  };
  StorageBackedObject.prototype.getObject = function() {
    return this.object;
  };
  StorageBackedObject.prototype.getKeys = function() {
    return this.keys;
  };
  StorageBackedObject.prototype.hasKey = function(key) {
    return this.object.hasOwnProperty(key);
  };

  return function(rootKey) {
    return new StorageBackedObject(rootKey, storage);
  };
});

