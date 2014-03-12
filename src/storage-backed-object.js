/*global angular */

// Stores an object in HTML storage in parts
// A single array for the keys, and separate objects for the values
// Means each can be edited without re-saving the entire object
// So is useful for larger structures.
// Object + keys is is the same instance for the lifetime of the StorageBackedObject
angular.module('storage-backed-object',['angularLocalStorage','angular-lo-dash'])
.factory('StorageBackedObject', function (storage) {
  'use strict';

  var sbObjects = [];

  function StorageBackedObject(_rootKey_, _storage_) {

    /* Private properties */

    var rootKey = _rootKey_;
    var storage = _storage_;

    var keys = storage.get(rootKey) || [];
    var object = {};

    /* Private methods */

    var getStorageKeyForKey = function(key) {
      return rootKey + '---VALUES---' + key;
    };

    var saveKeys = function() {
      storage.set(rootKey, keys);
    };

    var saveItemToStorage = function(key, value) {
      var storageKey = getStorageKeyForKey(key);
      if (-1 === keys.indexOf(key)) {
        keys.push(key);
        saveKeys();
      }
      storage.set(storageKey, angular.toJson(value));
    };

    var removeItemFromStorage = function(key) {
      var storageKey = getStorageKeyForKey(key);
      storage.remove(storageKey);
    };

    var getItemFromStorage = function(key) {
      var storageKey = getStorageKeyForKey(key);
      var item = angular.fromJson(storage.get(storageKey));
      return item;
    };

    var populateObject = function() {
      angular.forEach(keys, function(key) {
        object[key] = getItemFromStorage(key);
      });
    };

    var hasKey = function(key) {
      return object.hasOwnProperty(key);
    };

    /* Public Methods */

    this.set = function(key, value) {
      object[key] = value;
      saveItemToStorage(key, value);
      saveKeys();
    };

    this.remove = function(key) {
      delete object[key];
      var index = keys.indexOf(key);
      if (-1 !== index) {
        keys.splice(index, 1);
        saveKeys();
      }
      removeItemFromStorage(key);
    };

    this.get = function(key, defaultValue) {
      if (hasKey(key)) {
        return object[key];
      }
      if (typeof defaultValue !== 'undefined') {
        this.set(key, defaultValue);
        return defaultValue;
      }
      throw 'StorageBackedObject ' + rootKey + ' does not have property ' + key;
    };

    this.getObject = function() {
      return object;
    };

    /* Initialise by loading all items into memory */
    populateObject();
  }

  return function(rootKey) {
    return sbObjects[rootKey] || (sbObjects[rootKey] = new StorageBackedObject(rootKey, storage));
  };
});

