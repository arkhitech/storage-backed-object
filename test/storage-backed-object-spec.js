"use strict";

describe('Service: StorageBackedObject', function () {

  beforeEach(module('storage-backed-object'));

  var StorageBackedObject, sbObject;
  var storageKey = 'html5-storage-key';

  beforeEach(inject(function (_StorageBackedObject_) {
    StorageBackedObject = _StorageBackedObject_;
  }));

  beforeEach(inject(function (_StorageBackedObject_) {
    sbObject = StorageBackedObject(storageKey);
  }));

  it('instance should be an object with a get function', function () {
    expect(typeof sbObject.get).toBe('function');
  });

  it('instance should be an object with a set function', function () {
    expect(typeof sbObject.set).toBe('function');
  });

  it('instance should be an object with a remove function', function () {
    expect(typeof sbObject.remove).toBe('function');
  });

});
