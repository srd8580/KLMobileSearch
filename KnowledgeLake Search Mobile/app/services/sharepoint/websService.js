define(["jquery", 
		"domain/keyValuePair", 
		"services/sharepoint/soapServiceBase",
		//uncaught depends
		"extensions"], 
	function ($, keyValuePair, soapServiceBase) {
    
    var websService = function (siteUrl) {
        var self = this,
            serviceName = "Webs";
    
        /*self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, siteUrl, serviceName);*/
		$.extend(self, new soapServiceBase(siteUrl, serviceName));
        
        self.GetWeb = function (webUrl) {
            var parameters = [];
			
			if (webUrl.endsWith("/"))
				webUrl = webUrl.substring(0, webUrl.length - 1);
			
			parameters.push(new keyValuePair("webUrl", webUrl));
            
            return self.executeSoapMethod("GetWeb", parameters);
        }
        
        return self;
    };
    
    return websService;
});