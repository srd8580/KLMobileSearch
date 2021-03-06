/*global QUnit*/
define(["services/imaging/facetQuerySearchService", 
		"domain/site",
		"domain/credentialType",
		"domain/credential",
		"unitTests/unitTestSettings"],
    function (facetQuerySearchService, site, credentialType, credential, TestSettings) {
        QUnit.module("Testing facetQuerySearchService");
        
        
        QUnit.test("Test can instantiate facetQuerySearchService", function () {
            //arrange
            var service;
            
            //act
            service = new facetQuerySearchService({});
            
            //assert
            QUnit.ok(service);
        });

        QUnit.asyncTest("Test GetCurrentUserName with good credentials", function () {
            //arrange
            var service,
				testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            service = new facetQuerySearchService(testSite);
            
            //act
            var getCurrentUserNamePromise = service.GetCurrentUserName();
            
            //assert
            getCurrentUserNamePromise.done(function (result) {
                QUnit.equal(result.GetCurrentUserNameResult.value, TestSettings.currentUserName);                
                QUnit.start();
            });
            
            getCurrentUserNamePromise.fail(function (error) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
        
        QUnit.asyncTest("Test GetQueryUser with good credentials", function () {
            //arrange
            var service,
				testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            service = new facetQuerySearchService(testSite);
            
            //act
            var getQueryUserPromise = service.GetQueryUser(TestSettings.currentUserName);
            
            //assert
            getQueryUserPromise.done(function (result) {
                QUnit.equal(result.GetQueryUserResult.Name.value, TestSettings.currentUserName);                
                QUnit.start();
            });
            
            getQueryUserPromise.fail(function (error) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
        
        QUnit.asyncTest("Test GetQueriesForUser with good credentials", function () {
            //arrange
            var service,
				testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            service = new facetQuerySearchService(testSite);
            
            //act
            var getQueriesForUserPromise = service.GetQueriesForUser(TestSettings.currentUserName, TestSettings.ntlmTestUrl);
            
            //assert
            getQueriesForUserPromise.done(function (result) {
                QUnit.ok(true);                
                QUnit.start();
            });
            
            getQueriesForUserPromise.fail(function (error) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
        
        QUnit.asyncTest("Test FacetSearch with good credentials", function () {
            //arrange
            var service,
				testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            service = new facetQuerySearchService(testSite);
            
            //act
            var facetSearchPromise = service.FacetSearch(TestSettings.testKlaml);
            
            //assert
            facetSearchPromise.done(function (result) {
                QUnit.ok(true);                
                QUnit.start();
            });
            
            facetSearchPromise.fail(function (error) {
                QUnit.ok(false);
                QUnit.start();
            });
        });        
    });
