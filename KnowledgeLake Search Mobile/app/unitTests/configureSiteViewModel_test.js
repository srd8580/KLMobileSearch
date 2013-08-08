define(["system", 
		"viewmodels/configureSiteViewModel", 
		"domain/credentialType", 
		"domain/authenticationMode"],
    
	function (system, configureSiteViewModel, credentialType, authenticationMode) {
		var ntlmTestUrl = "http://prodsp2010.dev.local/sites/team4",
			adfsTestUrl = "https://kl.sharepoint.com/sites/devtesting",
			ntlmTestUser = "spadmin",
			ntlmTestPassword = "password",
			ntlmTestDomain = "dev.local",
			homeUrl = "#home",
			validImageCheck = "/valid",
			invalidImageCheck = "/invalid",
			questionImageCheck = "/question",
			office365SigninIndicator = "wa=wsignin1.0";
		
        QUnit.module("Testing configureSiteViewModel");
       
		QUnit.test("configureSiteViewModel initializes propertly", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			
			//assert
			QUnit.ok(vm);
			QUnit.ok(window.App);
			QUnit.ok(window.App.isMock);
			
			QUnit.equal(vm.url(), "http://");
			QUnit.equal(vm.siteTitle(), "");
			QUnit.equal(vm.sharePointVersion(), 0);
			QUnit.equal(vm.ntlmAuthUrl(), "http://_vti_bin/copy.asmx");
			QUnit.equal(vm.siteCredentialType(), credentialType.ntlm);
			QUnit.equal(vm.siteUserName(), "");
			QUnit.equal(vm.sitePassword(), "");
			QUnit.equal(vm.siteDomain(), "");
			QUnit.equal(vm.isWindowsCredential(), true);
			QUnit.equal(vm.isClaimsFormsCredential(), false);
			QUnit.equal(vm.statusMessage(), "");
			QUnit.equal(vm.showStatus(), false);
			QUnit.equal(vm.errorMessage(), "");
			QUnit.equal(vm.showError(), false);
			QUnit.equal(vm.isUrlValid(), false);
			QUnit.equal(vm.isCredentialsValid(), false);
			QUnit.ok(vm.urlValidationImageSrc().indexOf(questionImageCheck) > -1);
			QUnit.ok(vm.credValidationImageSrc().indexOf(questionImageCheck) > -1);
			
			QUnit.equal(vm.credentialTypes().length, 2);
			QUnit.equal(vm.credentialTypes()[0].key, credentialType.ntlm);
			QUnit.equal(vm.credentialTypes()[0].value, system.strings.windows);
			QUnit.equal(vm.credentialTypes()[1].key, credentialType.claimsOrForms);
			QUnit.equal(vm.credentialTypes()[1].value, system.strings.claimsForms);
			
			QUnit.equal(vm.isTitleValid(), false);			
        });
		
		QUnit.test("configureSiteViewModel.isLoggedOnUrl with exact url is true", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(ntlmTestUrl);
			
			//assert
			QUnit.ok(vm);
			QUnit.equal(vm.isLoggedOnUrl(ntlmTestUrl), true);
        });
		
		QUnit.test("configureSiteViewModel.isLoggedOnUrl: exact URL with Office 365 Logon is false", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(ntlmTestUrl);
			
			//assert
			QUnit.equal(vm.isLoggedOnUrl(ntlmTestUrl + office365SigninIndicator), false);
        });
		
		QUnit.test("configureSiteViewModel.isLoggedOnUrl: wrong url returns false", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(ntlmTestUrl);
			
			//assert
			QUnit.equal(vm.isLoggedOnUrl("http://www.google.com"), false);
        });
		
		QUnit.test("configureSiteViewModel test invalid siteTitle shows invalid (1)", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.siteTitle("");
			
			//assert
			QUnit.equal(vm.isTitleValid(), false);
		});
		
		QUnit.test("configureSiteViewModel test invalid siteTitle shows invalid (2)", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.siteTitle(null);
			
			//assert
			QUnit.equal(vm.isTitleValid(), false);
		});
		
		QUnit.test("configureSiteViewModel test invalid siteTitle shows invalid (3)", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.siteTitle("   ");
			
			//assert
			QUnit.equal(vm.isTitleValid(), false);
		});
		
		QUnit.test("configureSiteViewModel test valid siteTitle shows valid", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.siteTitle("hello");
			
			//assert
			QUnit.ok(vm);
			QUnit.equal(vm.isTitleValid(), true);
		});
		
		QUnit.test("configureSiteViewModel.parseCredentialType properly parses authentication modes", function () {
			//arrange
			var vm,
				ntlmAuth = authenticationMode.Windows,
				claimsAuth = authenticationMode.ClaimsOrForms,
				parsedNtlm,
				parsedClaims;
			
			//act
			vm = new configureSiteViewModel();
			parsedNtlm = vm.parseCredentialType(ntlmAuth);
			parsedClaims = vm.parseCredentialType(claimsAuth);
						
			//assert
			QUnit.equal(parsedNtlm, credentialType.ntlm);
			QUnit.equal(parsedClaims, credentialType.claimsOrForms);
        });
		
		QUnit.test("configureSiteViewModel.setTitle with already valid title doesn't reset it", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.siteTitle("hello");
			vm.setTitle("xxxx");
			
			//assert
			QUnit.ok(vm);
			QUnit.equal(vm.isTitleValid(), true);
			QUnit.equal(vm.siteTitle(), "hello");
        });
		
		QUnit.test("configureSiteViewModel.setTitle with invalid title does reset it", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.setTitle("xxxx");
			
			//assert
			QUnit.equal(vm.isTitleValid(), true);
			QUnit.equal(vm.siteTitle(), "xxxx");
        });
		
		QUnit.test("configureSiteViewModel.clearTitle really clears title", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.setTitle("xxxx");
			vm.clearTitle();
			
			//assert
			QUnit.ok(vm);
			QUnit.equal(vm.isTitleValid(), false);
			QUnit.equal(vm.siteTitle(), "");
        });
	
		QUnit.asyncTest("test error message resets after 5 seconds", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			
			//assert
			QUnit.equal(vm.validateAll(), false);
			QUnit.ok(vm.errorMessage());
			QUnit.notEqual(vm.errorMessage(), "");
			QUnit.equal(vm.showError(), true);
			
			setTimeout(function () {
				//error starts fade out at 5s
				QUnit.equal(vm.showError(), false);
				
				setTimeout(function () {
					//error is 100% gone at 6s
					QUnit.equal(vm.errorMessage(), "");
					QUnit.start();
                }, 1005);				
            }, 5005);
        });
		
		QUnit.asyncTest("test status message resets after 5 seconds", function () {
			//arrange
			var vm,
				msg = "message";
			
			//act
			vm = new configureSiteViewModel();
			vm.statusMessage(msg);
			
			//assert
			QUnit.ok(vm);
			QUnit.equal(vm.statusMessage(), msg);
			QUnit.equal(vm.showStatus(), true);
			
			setTimeout(function () {
				//error starts fade out at 5s
				QUnit.equal(vm.showStatus(), false);
				
				setTimeout(function () {
					//error is 100% gone at 6s
					QUnit.equal(vm.statusMessage(), "");
					QUnit.start();
                }, 1005);				
            }, 5005);
        });
		
		QUnit.test("configureSiteViewModel.closeSiteSettings navigates to home", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.closeSiteSettings();
			
			//assert
			QUnit.equal(window.App.currentUrl, homeUrl);
        });
		
		QUnit.test("configureSiteViewModel.setInvalidUrl puts vm in error state",  function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.setInvalidUrl();
			
			//assert
			QUnit.equal(vm.isUrlValid(), false);
			QUnit.ok(vm.urlValidationImageSrc().indexOf(invalidImageCheck) > -1);
			QUnit.ok(vm.credValidationImageSrc().indexOf(questionImageCheck) > -1);
			QUnit.equal(vm.statusMessage(), "");
			QUnit.notEqual(vm.errorMessage(), "");
		});
			
		QUnit.test("configureSiteViewModel.setValidUrl puts vm in success state",  function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(ntlmTestUrl);
			vm.setValidUrl();			
			
			//assert
			QUnit.ok(vm);
			QUnit.equal(vm.isUrlValid(), true);
			QUnit.ok(vm.urlValidationImageSrc().indexOf(validImageCheck) > -1);
			QUnit.ok(vm.credValidationImageSrc().indexOf(invalidImageCheck) > -1);
			QUnit.notEqual(vm.statusMessage(), "");
			QUnit.equal(vm.errorMessage(), "");
		});
		
		QUnit.test("configureSiteViewModel.resetUrlValidation puts vm in indeterminate state",  function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(ntlmTestUrl);
			vm.resetUrlValidation();			
			
			//assert
			QUnit.equal(vm.isUrlValid(), false);
			QUnit.equal(vm.isCredentialsValid(), false);
			QUnit.ok(vm.urlValidationImageSrc().indexOf(questionImageCheck) > -1);
			QUnit.ok(vm.credValidationImageSrc().indexOf(questionImageCheck) > -1);
			QUnit.equal(vm.statusMessage(), "");
			QUnit.equal(vm.errorMessage(), "");
		});
			
		QUnit.asyncTest("configureSiteViewModel.validateSiteUrl shows invalid with bad URL", function () {
			//arrange
			var vm,
				urlValidationPromise;
			
			//act
			vm = new configureSiteViewModel();
			vm.url("fsdafdsfsdaf");
			urlValidationPromise = vm.validateSiteUrl();
			
			//assert
			QUnit.equal(window.App.isLoading, true);
			QUnit.ok(urlValidationPromise);
			
			urlValidationPromise.done(function (credType) {
				QUnit.ok(false, "URL should not have been returned as valid but was");
				
				QUnit.start();
            });
			urlValidationPromise.fail(function (status) {
				QUnit.ok(true); 
				QUnit.equal(window.App.isLoading, false);
				
				QUnit.start();
            });						
        });
		
		QUnit.asyncTest("configureSiteViewModel.validateSiteUrl shows valid with good URL", function () {
			//arrange
			var vm,
				urlValidationPromise;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(ntlmTestUrl);
			urlValidationPromise = vm.validateSiteUrl();
			
			//assert
			QUnit.equal(window.App.isLoading, true);
			QUnit.ok(urlValidationPromise);
			
			urlValidationPromise.done(function (credType) {
				QUnit.ok(true);
				QUnit.equal(window.App.isLoading, false);
				QUnit.equal(credType, credentialType.ntlm);
				
				QUnit.start();
            });
			urlValidationPromise.fail(function (status) {
				QUnit.ok(true, "Could not validate " + ntlmTestUrl); 
				
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("configureSiteViewModel.validateSiteUrl validates O365 with good ADFS URL", function () {
			//arrange
			var vm,
				urlValidationPromise;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(adfsTestUrl);
			urlValidationPromise = vm.validateSiteUrl();
			
			//assert
			QUnit.equal(window.App.isLoading, true);
			QUnit.ok(urlValidationPromise);
			
			urlValidationPromise.done(function (credType) {
				QUnit.ok(true);
				QUnit.equal(window.App.isLoading, false);
				QUnit.equal(credType, credentialType.claimsOrForms);
				
				QUnit.start();
            });
			urlValidationPromise.fail(function (status) {
				QUnit.ok(true, "Could not validate " + adfsTestUrl); 
				
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("configureSiteViewModel.logonWindows fails with bad creds", function () {
			//arrange
			var vm,
				credValidationPromise;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(ntlmTestUrl);
			credValidationPromise = vm.logonWindows();
			
			//assert
			QUnit.ok(credValidationPromise);
			
			credValidationPromise.done(function (title, version) {
				QUnit.ok(false, "credential validation should have failed");	
				QUnit.start();
            });
			
			credValidationPromise.fail(function () {
				QUnit.ok(true);
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("configureSiteViewModel.logonWindows succeeds with good creds", function () {
			//arrange
			var vm,
				credValidationPromise;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(ntlmTestUrl);
			vm.siteUserName(ntlmTestUser);
			vm.sitePassword(ntlmTestPassword);
			vm.siteDomain(ntlmTestDomain);
			credValidationPromise = vm.logonWindows();
			
			//assert
			QUnit.ok(credValidationPromise);
			
			credValidationPromise.done(function (title, version) {
				QUnit.ok(true);	
				QUnit.start();
            });
			
			credValidationPromise.fail(function () {
				QUnit.ok(false, "credential validation failed when it should have been good");
				QUnit.start();
            });
        });
		
		//TODO: logon claims tests after we get logon stuff factored out
			
		QUnit.test("test configureSiteViewModel.validateAll with invalid url puts vm in error state", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			
			//assert
			QUnit.equal(vm.isUrlValid(), false);
			QUnit.equal(vm.validateAll(), false);  //this triggers error state
			QUnit.notEqual(vm.errorMessage(), "");
			QUnit.equal(vm.showError(), true);
        });
	
		QUnit.test("test configureSiteViewModel.validateAll validates bad URL", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			
			//assert
			QUnit.equal(vm.validateAll(), false);
			QUnit.equal(vm.errorMessage(), system.strings.urlInvalidMessage);
        });
		
		QUnit.test("test configureSiteViewModel.validateAll validates bad site title", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(ntlmTestUrl);
			vm.setValidUrl();
			
			//assert
			QUnit.ok(vm);
			
			QUnit.equal(vm.validateAll(), false);
			QUnit.equal(vm.errorMessage(), system.strings.siteTitleRequired);
        });
		
		QUnit.test("test configureSiteViewModel.validateAll validates bad credentials", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(ntlmTestUrl);
			vm.setValidUrl();
			vm.siteTitle("dfdsfds");
			
			//assert
			QUnit.equal(vm.validateAll(), false);
			QUnit.equal(vm.errorMessage(), system.strings.credentialsInvalidMessage);
        });
		
		QUnit.test("test configureSiteViewModel.validateAll validates all good", function () {
			//arrange
			var vm;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(ntlmTestUrl);
			vm.setValidUrl();
			vm.siteTitle("dfdsfds");
			vm.isCredentialsValid(true);
			
			//assert
			QUnit.equal(vm.validateAll(), true);
			QUnit.equal(vm.errorMessage(), "");
        });
		
		QUnit.test("test configureSiteViewModel.saveSiteSettings won't save invalid site", function () {
			//arrange
			var vm,
				saveSettingsPromise;
			
			//act
			vm = new configureSiteViewModel();
			saveSettingsPromise = vm.saveSiteSettings();
						
			//assert
			QUnit.ok(!saveSettingsPromise);
		});
		
		QUnit.asyncTest("test configureSiteViewModel.saveSiteSettings saves valid site", function () {
			//arrange
			var vm,
				saveSettingsPromise;
			
			//act
			vm = new configureSiteViewModel();
			vm.url(ntlmTestUrl);
			vm.setValidUrl();
			vm.siteTitle("dfdsfds");
			vm.isCredentialsValid(true);
			saveSettingsPromise = vm.saveSiteSettings();
						
			//assert
			QUnit.equal(vm.validateAll(), true);
			QUnit.ok(saveSettingsPromise);
			
			saveSettingsPromise.done(function () {
				QUnit.equal(window.App.currentUrl, homeUrl);
				QUnit.start();
            });
			
			saveSettingsPromise.fail(function () {
				QUnit.ok(false, "saveSiteSettings failed when it should have succeeded");
				QUnit.start();
            });
        });
    });
