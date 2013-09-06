define(["knockout",
		"system",
        "jquery", 
        "factory/queryServiceFactory", 
        "domain/keywordConjunction", 
        "factory/logonServiceFactory", 
        "IDocumentService",
		"ISiteDataService"], 
    function (ko, system, $, QueryServiceFactory, keywordConjunction, LogonServiceFactory, documentService, SiteDataService) {
    var resultsViewModel = function () {
        var self = this,
            documentUrl = "#document";
        
		self.errorMessage = ko.observable("");
		self.errorMessage.subscribe(function (newValue) {
			if (newValue) {
                system.showToast(newValue);
            }
        });
		
        self.resultDataSource = ko.observableArray(); 
        
        self.selectedResult = null;
        self.windowRef = null; 
		
        self.navBarVisible = ko.observable(false);
        self.navBarVisible.subscribe(function (newValue) {
			$(".nav-button").kendoMobileButton();
        });

        self.isBusy = ko.observable(false);
		self.isBusy.subscribe(function (newValue) {
			system.logVerbose("reusltsViewModel.isBusy is " + newValue);
			
			if (newValue == true) {
				window.App.showLoading();
            }
			else {
				window.App.hideLoading();
            }
        });
        
		  
		self.setErrorMessage = function (message) {
			self.errorMessage("");
			self.errorMessage(message);
		};
				
		
        self.SetDataSource = function (results) {
            self.selectedResult = null;               
            self.resultDataSource([]);

            if(results)
            {
                self.resultDataSource(results);
            }
        }
        
        self.init = function (e) {
			$(".km-content").kendoTouch({
                enableSwipe: true,
                swipe: self.swipe 
            });
        }
		
		self.swipe = function (e) {
			system.logVerbose("results listview swiped");
			if(e.direction == "right")
            {
				window.App.navigate("#:back");
            }
        }
        
        self.beforeShow = function (e) {
            system.logVerbose("resultsViewModel beforeShow");   			
        }
		
		self.show = function (e) {
			system.logVerbose("resultsViewModel show");
			
			if(savedSearchViewModel.site)  
                self.keywordSearch(savedSearchViewModel.site(), savedSearchViewModel.keyword());
        }
        
        self.hide = function (e) {            
            self.setSelectedResult(null);
            self.SetDataSource([]);
        }
        
        self.setSelectedResult = function (selection) {
			if (event)
				event.stopImmediatePropagation();
                
            if(self.selectedResult === selection)
                self.selectedResult = null;
            
            else
                self.selectedResult = selection;
            
            self.navBarVisible(self.selectedResult);
        }
            
        self.isSelectedResult = function (item) {
			return self.navBarVisible() && self.selectedResult === item;
        }
        
        self.editProperties = function () {
            if(self.selectedResult)
            {
                window.App.navigate(documentUrl);                    
            }
        }
        
        self.navigateToResult = function (selection) {
            var dfd = $.Deferred(), 
                service,
                logonService;
            
            if(selection && savedSearchViewModel.site())
            {
                window.App.loading = "<h1>" + system.strings.loading + "</h1>";
                self.isBusy(true);
                
                service = new documentService(selection.url);        
                logonService = LogonServiceFactory.createLogonService(savedSearchViewModel.site().url, savedSearchViewModel.site().credential.credentialType);

                logonPromise = logonService.logon(savedSearchViewModel.site().credential.domain, 
                                                  savedSearchViewModel.site().credential.userName, 
                                                  savedSearchViewModel.site().credential.password,
                                                  selection.url);
            
                logonPromise.done(function (result) {
                    getDisplayFormUrlPromise = service.getDisplayFormUrl();
                
                    getDisplayFormUrlPromise.done(function (result) {  
						self.isBusy(false);
						
						result = encodeURI(result);
						
						system.logVerbose("display form obtained at: " + result);
                        
                        self.windowRef = window.open(result, "_system");
						dfd.resolve();
                    });
                    
                    getDisplayFormUrlPromise.fail(function (error) {
                        self.isBusy(false);
						
						system.logVerbose("display form could not be obtained: " + error);
						self.setErrorMessage(system.strings.unauthorized);
                        
                        dfd.reject(error);
                    });
                });
                
                logonPromise.fail(function (error) {
                    self.isBusy(false);
					
					system.logVerbose("could not navigate to result. logon failed.");
					self.setErrorMessage(system.strings.unauthorized);
                    
                    dfd.reject(error);
                });
            }
            
            return dfd.promise();
        }
        
        self.keywordSearch = function (searchSite, keyword) {
            var dfd = $.Deferred(),
                service,
                logonService;
            
            window.App.loading = "<h1>" + system.strings.searching + "</h1>";
            self.isBusy(true);
            
            service = new QueryServiceFactory.getQueryService(searchSite.url, searchSite.majorVersion);
            logonService = LogonServiceFactory.createLogonService(searchSite.url, searchSite.credential.credentialType);
            
            logonPromise = logonService.logon(searchSite.credential.domain, searchSite.credential.userName, searchSite.credential.password);
            
            logonPromise.done(function (result) {
                
                searchPromise = service.keywordSearch(keyword.split(" "), keywordConjunction.and, true);
                
                searchPromise.done(function (result) {
                    self.SetDataSource(result);
                    
                    dfd.resolve(true);
                    
                    self.isBusy(false);
                });
                
                searchPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {				
                    dfd.reject(errorThrown);
                    
                    self.isBusy(false);
                });
            });
            
            logonPromise.fail(function (error) {
                dfd.reject(error);
                
                self.isBusy(false);
            });
            
            return dfd.promise();
        }
            
        return self;
    };
    
    return resultsViewModel;
});
