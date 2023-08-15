// student.js
const { getDatabase } = require('./db');
const { ObjectId } = require('mongodb');
const COLLECTION_NAME = 'students';

function getAllStudents() {
  const db = getDatabase();
  return db.collection(COLLECTION_NAME).find().toArray();
}

function createStudent(student) {
  const db = getDatabase();
  return db.collection(COLLECTION_NAME).insertOne(student);
}

function updateStudent(id, updates) {
  const db = getDatabase();
  return db.collection(COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, { $set: updates });
}

function deleteStudent(id) {
  const db = getDatabase();
  return db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
}

function getStudent(id) {
  const db = getDatabase();
  return db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
}

module.exports = { getAllStudents, createStudent, updateStudent, deleteStudent, getStudent };
