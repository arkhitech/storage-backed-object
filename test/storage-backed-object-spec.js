"use strict";

describe('StorageBackedObject', function () {

  beforeEach(module('storage-backed-object'));

  var StorageBackedObject, storage, sbObject;
  var rootKey, testKey, testKeyWithNoValue;
  var testValueArray, testValueObject;

  var html5key = function(root, key) {
    return root + '---VALUES---' + key;
  };

  beforeEach(inject(function (_StorageBackedObject_, _storage_) {
    StorageBackedObject = _StorageBackedObject_;
    storage = _storage_;
  }));

  beforeEach(function() {
    rootKey = 'test-root-key';
  });

  describe('returned object', function() {
    var sbObject1, sbObject2;

    beforeEach(function() {
      sbObject1 = StorageBackedObject(rootKey);
      sbObject2 = StorageBackedObject(rootKey);
    })

    it('must be the same instance for each factory call', function() {
      expect(sbObject1 === sbObject2).toBe(true);
    });
  });

  describe('function', function() {
    beforeEach(function () {
      testKey = 'test-key';
      testKeyWithNoValue = 'not-assigned-a-value';
      testValueObject = {}; 
      sbObject = StorageBackedObject(rootKey);
    });

    describe('set', function() {
      beforeEach(function() {
        spyOn(storage, 'set');
        sbObject.set(testKey, testValueObject);
      })

      it('should call storage.set with ' + html5key(rootKey, testKey), function() {
        expect(storage.set).toHaveBeenCalledWith(html5key(rootKey, testKey),testValueObject);
      });
    });

    describe('get', function() {
      beforeEach(function() {
        spyOn(storage,'get').andCallThrough();
        sbObject.set(testKey, testValueObject);
      })

      afterEach(function() {
        sbObject.remove(testKeyWithNoValue);
      });

      it('should return what was passed to set', function() {
        expect(sbObject.get(testKey)).toEqual(testValueObject);
      });

      it('should return the same object after successive calls to get', function() {
        var first = sbObject.get(testKey);
        var second = sbObject.get(testKey);
        expect(first === second).toBe(true);
      });

      it('should throw an exception if getting a non-existant key', function() {
        expect(function() {
          sbObject.get(testKeyWithNoValue);
        }).toThrow();
      });

      it('should retrieve and store the default value if passed', function() {
        var retrieved1 = sbObject.get(testKeyWithNoValue, testValueObject);
        expect(retrieved1).toEqual(testValueObject);

        var retrieved2 = sbObject.get(testKeyWithNoValue);
        expect(retrieved2).toEqual(testValueObject);
      });
    })

    describe('remove', function() {
      beforeEach(function() {
        spyOn(storage,'remove').andCallThrough();
      })

      it('should call storage.remove with ' + html5key(rootKey, testKey), function() {
        sbObject.remove(testKey);
        expect(storage.remove).toHaveBeenCalledWith(html5key(rootKey, testKey));
      });

      it('should cause subsequent calls to get to throw an exception', function() {
        sbObject.set(testKey, testValueObject);
        sbObject.remove(testKey);
        expect(function() {
          sbObject.get(testKey);
        }).toThrow();
      });
    });

  });

});
