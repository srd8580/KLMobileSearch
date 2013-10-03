define(["knockout", 
        "system"],
function (ko, system) {
	var viewModelBase = function () {
		var self = this;
		
		self.strings = function () {
			return system.strings;
		};
		
		self.message = ko.observable("");
        self.isBusy = ko.observable(false);
		
		self.isBusy.subscribe(function (newValue) {
			system.logVerbose("viewModelBase.isBusy set to " + newValue);
			
			if (window.App) {
				if (newValue == true) {
					window.App.showLoading();
	            }
				else {
					window.App.hideLoading();
	            }
			}
        });
				  
		self.setMessage = function (msg) {
			self.message("");
			self.message(msg);
		};
			
        self.message.subscribe(function (newValue) {
            if (newValue) {
				system.showToast(newValue);
			}
        });
		
    
		self.init = function (e) {
			system.logVerbose("base class viewModelBase.init called");
        } 
				
		self.beforeShow = function (e) {
			system.logVerbose("base class viewModelBase.beforeShow called");
        } 
		
		self.show = function (e) {
			system.logVerbose("base class viewModelBase.show called");
        } 
			
		self.afterShow = function (e) {
			system.logVerbose("base class viewModelBase.afterShow called");
        } 
			
		self.hide = function (e) {
			system.logVerbose("base class viewModelBase.hide called");
        } 
	
		return self;
    };
	
	return viewModelBase;
});
		