define(["jquery",
		"HttpService",
		"LogonServiceFactory"],
function ($, HttpService, LogonServiceFactory) {
	var secureHttpService = function () {
		var self = this;
		
		self.xhr = function (options, site) {
			var logonPromise,
				xhrPromise,
				dfd = $.Deferred();
		
			//TODO: map WinJS options to JQuery as needed on all methods
			
			if (!site || !site.credential || typeof site.credential.userName === 'undefined') {
				return HttpService.xhr(options);
            }
			
			logonPromise = self.logonAsync(site);
			
			logonPromise.done(function () {
				xhrPromise = HttpService.xhr(options);
				
				xhrPromise.done(function (result, textStatus, jqXHR) {
					dfd.resolve(result, textStatus, jqXHR);
	            });
				
				xhrPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					dfd.reject(XMLHttpRequest, textStatus, errorThrown);
	            });
            });
			
			logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				dfd.reject(XMLHttpRequest, textStatus, errorThrown);
            });
		
			return dfd.promise();
        }
		
		self.get = function (url, site) {
			return self.xhr({
				url: url,
				type: "GET",
            }, site);
        }	
		
		self.post = function (url, data, site) {
			return self.xhr({
				url: url,
				type: "POST",
				data: data
            }, site);
        }
		
		self.logonAsync = function (site) {
			var logonService = LogonServiceFactory.logonServiceFromSite(site);			
			return logonService.logonToSiteAsync(site);
        }
	
		return self;
	};
	
	return new secureHttpService();
});