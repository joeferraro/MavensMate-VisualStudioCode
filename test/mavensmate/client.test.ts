import * as expect from 'expect.js';
import * as nock from 'nock';

import * as vscode from 'vscode';
import { MavensMateClient } from '../../src/mavensmate/client';

suite("MavensMate Client", () => {
  let mavensMateClientOptions = {
    baseURL: 'http://localhost:55555'
  }; 
  let mavensMateClient = new MavensMateClient(mavensMateClientOptions);
  suite("isAppAvailable", () => {
    suite("server is up", () => {
      setup(() => {
        nock(mavensMateClientOptions.baseURL)
          .get('/app/home/index')
          .reply(200, 'OK');
      });
      
      test("returns true", () => {
        return mavensMateClient.isAppAvailable()
          .then((isAvailable) =>{
            expect(isAvailable).to.be.true;
          });
      });
    });
    
    suite("server is down", () => {
      test("returns an error", () => {
        return mavensMateClient.isAppAvailable()
          .then((isAvailable) =>{
            expect().fail("Shouldn't be available");
          })
          .catch((requestError) => {
            expect(requestError).to.not.be(undefined);
          });
      });
    });
  });
});