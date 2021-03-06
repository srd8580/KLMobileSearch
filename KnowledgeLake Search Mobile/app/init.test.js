//globals:
//**require**//
var App,
    AppLoaded;

require(["config"], function (config) {
    require.config(config);
        
    require(["jquery", 
             "knockout", 
             "kendo",
             "application",
			 "logger",
			 "extensions",
             "framework/logLevel",
			 "framework/klNavigator",
             "FileManagement"],
    function($, ko, kendo, application, logger, extensions, logLevel, navigator, File) {
		var appHref = window.WinJS ? "default.html" : "index.html",
			testRootPath = 'unitTests/',
			testsToRun = [
                          testRootPath + "configureSiteViewModel_test",
                          testRootPath + "siteDataCachingService_test",	
                          testRootPath + "resultsViewModel_tests",                            
                          testRootPath + "savedSearchViewModel_tests",
                          testRootPath + "viewModelBase_tests",
                          testRootPath + "homeViewModel_tests",
                          testRootPath + "application_tests",
                          testRootPath + "siteDataService_tests",
						  testRootPath + "logger_tests",
						  testRootPath + "extensions_tests",
                          testRootPath + "keyValuePair_tests",
						  testRootPath + "rootViewModel_tests",						  
                          testRootPath + "websService_tests",
                          testRootPath + "formsLogonService_tests",
                          testRootPath + "logFileManager_tests",
                          testRootPath + "listsService_tests",
                          testRootPath + "authenticationService_tests",
                          testRootPath + "searchService_tests",
                          testRootPath + "soapParsingService_tests",						  
                          testRootPath + "facetService_tests",
                          testRootPath + "encryptionService_tests",
						  testRootPath + "httpProtocols_tests",
						  testRootPath + "userNameParser_tests",
                          testRootPath + "credential_tests",
						  testRootPath + "credentialType_tests",
						  testRootPath + "keywordConjunction_tests",
						  testRootPath + "result_tests",
                          testRootPath + "searchFieldProperty_tests",
						  testRootPath + "searchType_tests",
						  testRootPath + "site_tests",
                          testRootPath + "klamlBuilderService_tests",
                          testRootPath + "guid_tests",
                          testRootPath + "logonServiceFactory_tests",
                          testRootPath + "dateTimeConverter_tests",
                          testRootPath + "iconConverter_tests",
						  testRootPath + "logLevel_tests",
						  testRootPath + "logsViewModel_tests",
                          testRootPath + "searchBuilderService_tests",
                          testRootPath + "office365Service_tests",
                          testRootPath + "queryServiceFactory_tests",
                          testRootPath + "documentViewModel_tests",		                          
                          testRootPath + "ntlmLogonService_tests",
                          testRootPath + "FileManagement_tests",                          				
                          testRootPath + "sqlQueryService_tests",
                          testRootPath + "kqlQueryService_tests",
                          testRootPath + "authenticationMode_tests",
                          testRootPath + "search_tests",
                          testRootPath + "searchProperty_tests",
                          testRootPath + "promiseRejectResponse_tests",
						  testRootPath + "promiseResolveResponse_test",
                          testRootPath + "validationService_tests",
                          testRootPath + "searchParsingService_tests",
                          testRootPath + "catalogPropertyCtlType_test",
                          testRootPath + "imagingDetService_tests",
                          testRootPath + "serverSavedService_tests",
                          testRootPath + "documentService_tests",                                    
                          testRootPath + "searchBuilderViewModel_test",
                          testRootPath + "office365LogonService_tests",                          
                          testRootPath + "adfs365LogonService_tests",
                          testRootPath + "klNavigator_tests",						  
						  testRootPath + "keywordBoxHandler_tests",
                          testRootPath + "localization_tests"
                          //testRootPath + "FileTransfer_tests", //not currently used						  
                          //ADDITIONAL TESTS GO HERE
                         ];
        
        window.AppLoaded = ko.observable(false);
        
        if (!config.isQunit && window.location.href.indexOf(appHref) < 0) {
            window.location.href = appHref;
			return;
        }
		
        //add tests that CANNOT be run in the SIMULATOR here
        /*if (!application.isRunningInSimulator()) {
            testsToRun.push();
        }*/
        
        QUnit.moduleStart(function (details) {
            logger.setLogLevel(logLevel.Verbose);
        });
		
		QUnit.testStart(function () {
			application.navigator = new navigator();
			window.location.hash = "";
        });
		        
        require(testsToRun, function() {           
            QUnit.start(); 
        });
    });
});