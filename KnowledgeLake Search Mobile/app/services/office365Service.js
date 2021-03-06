define(["jquery", 
		"application",
		"logger",
		"domain/Constants",
		"domain/office365LogonType",
		"domain/office365Metadata",
		"HttpService",
		"jsUri"], 
function ($, application, logger, Constants, office365LogonType, office365Metadata, HttpService, Uri) {
	var office365Service = function () {
		var self = this;
				
		self.getOffice365MetadataAsync = function (userName) {
			var dfd = $.Deferred(),
				responseJson,
				nsType = office365LogonType.unknown,
				adfsFullUri = "",
				requestBody = Constants.userRealmRequestFormat.replace("{userName}", userName),
				httpPromise;
			
			httpPromise = HttpService.xhr({
				url: Constants.office365UserRealm,
				async: true,
				type: "POST",
				processData: false,
				contentType: "application/x-www-form-urlencoded",
				cache: false,
				data: requestBody,
				dataType: "json",
				timeOut: application.ajaxTimeout
            });
			
			httpPromise.done(function (result, textStatus, xhr) {
			    adfsFullUri = "";
			    responseJson = typeof xhr === 'object' && typeof xhr.responseText === 'string' ? JSON.parse(xhr.responseText) : result;
				nsType = office365LogonType.unknown;
				
				logger.logVerbose("Got result from office365UserRealm: " + JSON.stringify(responseJson));
					
				try {
					nsType = responseJson && responseJson.NameSpaceType ? responseJson.NameSpaceType : nameSpaceType.unknown;
                }
				catch (e) {
					logger.logDebug("Failed to parse user realm request: " + e.message);
                }
				
				try {
					adfsFullUri = responseJson && responseJson.AuthURL ? responseJson.AuthURL : "";
                }
				catch (e) {
					logger.logDebug("Failed to parse user realm request: " + e.message);
                }
				
				dfd.resolve(new office365Metadata(nsType, adfsFullUri));
            });
			
			httpPromise.fail(function  (XMLHttpRequest, textStatus, errorThrown) {
				logger.logError("Get User Realm failed with status: " + textStatus);
				logger.logError("Get User Realm failed with HTTP status: " + XMLHttpRequest.status);
				
                dfd.reject(new office365Metadata(nsType, adfsFullUri));
            });
			
			return dfd.promise();
        }
	
		return self;
    };
	
	return office365Service;
});