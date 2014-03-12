/*global describe, module, it, beforeEach, afterEach, inject, expect, spyOn */

describe('StorageBackedObject', function () {
  'use strict';

  beforeEach(module('storage-backed-object'));

  var StorageBackedObject, storage, sbObject;
  var rootKey, testKey, testKeyWithNoValue;
  var testValueObject;

  var html5key = function(root, key) {
    return root + '---VALUES---' + key;
  };

  beforeEach(inject(function (_StorageBackedObject_, _$window_) {
    StorageBackedObject = _StorageBackedObject_;
    storage = _$window_.localStorage;
  }));

  beforeEach(function() {
    rootKey = 'test-root-key';
  });

  describe('returned object', function() {
    var sbObject1, sbObject2;

    beforeEach(function() {
      sbObject1 = StorageBackedObject(rootKey);
      sbObject2 = StorageBackedObject(rootKey);
    });

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
        spyOn(storage, 'setItem');
        sbObject.set(testKey, testValueObject);
      });

      it('should call storage.setItem with ' + html5key(rootKey, testKey), function() {
        expect(storage.setItem).toHaveBeenCalledWith(html5key(rootKey, testKey), angular.toJson(testValueObject));
      });
    });

    describe('get', function() {
      beforeEach(function() {
        spyOn(storage,'getItem').andCallThrough();
        sbObject.set(testKey, testValueObject);
      });

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

      it('should allow a false default value', function() {
        var retrieved1 = sbObject.get(testKeyWithNoValue, false);
        expect(retrieved1).toEqual(false);
      });

      it('should allow a null default value', function() {
        var retrieved1 = sbObject.get(testKeyWithNoValue, null);
        expect(retrieved1).toEqual(null);
      });
    });

    describe('set', function() {
      var testValueObjectWithDollar, testValueObjectWithoutDollar;

      beforeEach(function() {
        spyOn(storage,'setItem').andCallThrough();
        testValueObjectWithDollar = {'$test-with-dollar':'test-value1', 'test-without-dollar':'test-value2'};
        testValueObjectWithoutDollar = {'test-without-dollar':'test-value2'};
        sbObject.set(testKey, testValueObjectWithDollar);
      });

      it('should call storage.set with objects but with keys beggining with $ removed', function() {
        expect(storage.setItem).toHaveBeenCalledWith(html5key(rootKey, testKey),angular.toJson(testValueObjectWithoutDollar));
      });

      afterEach(function() {
        sbObject.remove(testKey);
      });
    });

    describe('remove', function() {
      beforeEach(function() {
        spyOn(storage,'removeItem').andCallThrough();
      });

      it('should call storage.remove with ' + html5key(rootKey, testKey), function() {
        sbObject.remove(testKey);
        expect(storage.removeItem).toHaveBeenCalledWith(html5key(rootKey, testKey));
      });

      it('should cause subsequent calls to get to throw an exception', function() {
        sbObject.set(testKey, testValueObject);
        sbObject.remove(testKey);
        expect(function() {
          sbObject.get(testKey);
        }).toThrow();
      });
    });

    describe('getObject', function() {
      it('should return an object with key and value equal to what was set', function() {
        sbObject.set(testKey, testValueObject);
        var object = sbObject.getObject();
        expect(object[testKey]).toEqual(testValueObject);
      });

      it('should return the same object on each call', function() {
        var object1 = sbObject.getObject();
        var object2 = sbObject.getObject();
        expect(object1 === object2);
      });

      it('should be automatically updated with later calls to set', function() {
        var object = sbObject.getObject();
        sbObject.set(testKey, testValueObject);
        expect(object[testKey]).toEqual(testValueObject);
      });
    });
  });
});
