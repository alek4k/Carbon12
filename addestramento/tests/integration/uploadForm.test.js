const request = require("supertest");
const Server = require('../../server');
const CSVr = require('../../fileManager/csv_reader.js');
const fs = require('fs');
const assert = require('assert');
const formidable = require('formidable');
const superAgent = require('superagent');
var http = require('http');
const express = require('express');

const server = new Server();


let testFilePath = null;
describe('POST /api/v1/documentations/upload - upload a new documentation file', () => {
    const filePath = './predittore.json';

    const FormData = require('form-data')
    const fetch = require('node-fetch')

    const body = new FormData()

    body.append(
        'operations',
        JSON.stringify({
            query:`
      mutation($file: Upload!) {
        uploadFile(file: $file) {
          id
        }
      }`,
            variables: {
                file: null
            }
        })
    );
    body.append('files', JSON.stringify({ 1: ['./predittore.json'] }));
    //body.append('1', 'a', { filename: 'a.txt' });

    const response = fetch('http://localhost:8080/uploadForm', { method: 'POST', body });

    const t5 = request(server.app)
        .post('/fileUpload')           // Attach the file with key 'file' which is corresponding to your endpoint setting.
        .attach('files', '/home/alessandro/Scrivania/Carbon12/addestramento/predittore.json')
        .then((res) => {
            const {success, message, filePath} = res.body;
            //expect(success).toBeTruthy();
            //expect(message).toBe('Uploaded successfully');
            //expect(typeof filePath).toBeTruthy();            // store file data for following tests
            testFilePath = filePath;
        })
        .catch(err => console.log(err));

    server.uploadForm(t5, null);


});

