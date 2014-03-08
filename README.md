storage-backed-object [![Build Status](https://api.travis-ci.org/intelligentgolf/storage-backed-object.png?branch=master)](https://travis-ci.org/intelligentgolf/storage-backed-object) [![Coverage Status](https://coveralls.io/repos/intelligentgolf/storage-backed-object/badge.png?branch=master)](https://coveralls.io/r/intelligentgolf/storage-backed-object?branch=master) [![Code Climate](https://codeclimate.com/github/michalc/storage-backed-object.png)](https://codeclimate.com/github/michalc/storage-backed-object)
=====================

Simple AngularJS service to store an object of key/values in HTML5 storage. This can be useful when wanting to store complex data that survives browser refreshes.

Usage
-----

Add the dependency to your AngularJS app:

    // Add module dependency 
    angular.module('myApp', ['storage-backed-object']);
    
Then use it by injecting `StorageBackedObject` into your services:
       
    angular.service('MyService', function(StorageBackedObject) {
      // Create the object
      var users = StorageBackedObject('users');
    
      // Store an item by key
      users.set(1234, {name: 'John Smith'})
    
      // Fetch an item by key
      var user = users.get('1234');
    
      // Remove an item by key
      users.remove(1234);
    });    
  

Properties
----------

Repeated calls to `get` returns the exact same value.

    users.set(1234, {name: 'John Smith'});
    users.get(1234) === users.get(1234); // True
    
This makes it safe to repeatedly call `get` for the same key, without using more memory.
    
    
Under the hood
--------------

All the values are fetched from HTML5 storage when the object is created. This behaviour may change in future versions.

Each value of the object is stored in a separate HTML5 storage item. This avoids long json encodes  when setting elements.

    
    
    
