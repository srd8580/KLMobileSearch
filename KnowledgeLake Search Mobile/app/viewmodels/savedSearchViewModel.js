define(["knockout", "system", "viewmodels/searchViewModel", "services/searchDataCachingService", 'services/keywordValidationService'], 
    function (ko, system, searchViewModel, SearchDataCachingService, ValidationService) {
        var savedSearchViewModel = function () {
            var self = this,
                resultsUrl = "#results";
            
            self.searchDataSource = ko.observable(null);
            
            self.SetDataSource = function (site, searches) {               
                self.searchDataSource(null);
                
                if(searches)
                {
                    self.searchDataSource(new searchViewModel(site, searches));
                }
            }
            
            self.LoadSearchData = function () {
                var loadSitesPromise = SearchDataCachingService.LoadSearches(homeViewModel.selectedSite);
              
                loadSitesPromise.done(function (result) {
                    if (result.response && Object.prototype.toString.call(result.response) === '[object Array]' && result.response.length > 0)
                        self.SetDataSource(homeViewModel.selectedSite, result.response);
                });
              
                loadSitesPromise.fail(function (error) {
                    // don't know exactly how this should be handled (no saved searches, local search file not found, filesystem instance not initialized)
                });            
            }
            
            self.init = function (e) {
                system.logVerbose("searchViewModel init");
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("searchViewModel beforeShow");
                
                if(homeViewModel.selectedSite)
                {
                    // placeholder until search data has been loaded
                    self.SetDataSource(homeViewModel.selectedSite, []);
                    self.LoadSearchData();
                }
            }
            
            self.show = function (e) {
                system.logVerbose("searchViewModel show");
            }
            
            self.afterShow = function (e) {
                system.logVerbose("searchViewModel afterShow");
            }
            
            self.hide = function (e) {
                system.logVerbose("searchViewModel hide");
            }
            
            self.search = function (e) {
                window.App.navigate(resultsUrl);
            }    
            
            self.isKeywordValid = ko.computed(function () {
                if(self.searchDataSource())
                {
                    return ValidationService.validateKeyword(self.searchDataSource().keyword());
                }
                
                return false;
            });
            
            self.onSearchKeyUp = function (selection, event) {
				if (event.keyCode === 13)
					self.search(selection);
            }
            
            return self;
        };
        
        return savedSearchViewModel;
    });