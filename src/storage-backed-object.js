/*global angular */

// Stores an object in HTML storage in parts
// A single array for the keys, and separate objects for the values
// Means each can be edited without re-saving the entire object
// So is useful for larger structures.
// Object + keys is is the same instance for the lifetime of the StorageBackedObject
angular.module('storage-backed-object',['angular-lo-dash'])
.factory('StorageBackedObject', function ($window) {
  'use strict';

  var sbObjects = [];

  function StorageBackedObject(_rootKey_) {

    /* Private properties */

    var rootKey = _rootKey_;
    var storage = $window.localStorage;
    var object = {};
    var keys;

    /* Private methods */

    var saveToStorage = function(key, value) {
      storage.setItem(key, angular.toJson(value));
    };

    var removeFromStorage = function(key) {
      storage.removeItem(key);
    }

    var getFromStorage = function(key) {
      return angular.fromJson(storage.getItem(key));
    }

    var getStorageKeyForKey = function(key) {
      return rootKey + '---VALUES---' + key;
    };

    var saveKeys = function() {
      storage.setItem(rootKey, angular.toJson(keys));
    };

    var saveObjectItemToStorage = function(key, value) {
      var storageKey = getStorageKeyForKey(key);
      if (-1 === keys.indexOf(key)) {
        keys.push(key);
        saveKeys();
      }
      storage.setItem(storageKey, angular.toJson(value));
    };

    var removeObjectItemFromStorage = function(key) {
      removeFromStorage(getStorageKeyForKey(key));
    };

    var getObjectItemFromStorage = function(key) {
      return getFromStorage(getStorageKeyForKey(key));
    };

    var populateObject = function() {
      angular.forEach(keys, function(key) {
        object[key] = getObjectItemFromStorage(key);
      });
    };

    var hasKey = function(key) {
      return object.hasOwnProperty(key);
    };

    /* Public Methods */

    this.set = function(key, value) {
      object[key] = value;
      saveObjectItemToStorage(key, value);
      saveKeys();
    };

    this.remove = function(key) {
      delete object[key];
      var index = keys.indexOf(key);
      if (-1 !== index) {
        keys.splice(index, 1);
        saveKeys();
      }
      removeObjectItemFromStorage(key);
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
    keys = getFromStorage(rootKey) || [];
    populateObject();

  }

  return function(rootKey) {
    return sbObjects[rootKey] || (sbObjects[rootKey] = new StorageBackedObject(rootKey));
  };
});

