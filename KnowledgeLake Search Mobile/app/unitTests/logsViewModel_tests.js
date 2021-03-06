/*global QUnit*/
define(["viewmodels/logsViewModel",
        "logger",],
	function (logsViewModel, logger) {
		QUnit.module("Testing viewmodels/logsViewModel");
		
		QUnit.test("Test logsViewModel instantiates OK", function () {
			//arrange
			var vm;
			
			//act
			vm = new logsViewModel();
			
			//assert
			QUnit.ok(vm);
			QUnit.ok(vm.logs());
			QUnit.ok(vm.onAfterShow);
			QUnit.ok(vm.emailLogsToSupport);
        });
		
		QUnit.test("Test logsViewModel.onAfterShow loads logs", function () {
			//arrange
			var vm;
			
		    //act
			logger.logFatal("test");
			vm = new logsViewModel();
			vm.onAfterShow();
			
			//assert
			QUnit.ok(vm.logs());
			QUnit.notEqual(vm.logs().length, 0);
			QUnit.equal(vm.isBusy(), false);
		});
		
		QUnit.asyncTest("Test logsViewModel.emailLogsToSupport succeeds", function () {
		    //arrange
		    var vm,
				promise;

		    //act
		    vm = new logsViewModel();
		    promise = vm.emailLogsToSupport();

		    //assert
		    promise.done(function () {
		        QUnit.ok(true);
		        QUnit.start();
		    });

		    promise.fail(function () {
		        QUnit.ok(false);
		        QUnit.start();
		    });
		});

		QUnit.asyncTest("Test logsViewModel.createLogFile succeeds", function () {
		    //arrange
		    var vm,
				promise;

		    //act
		    vm = new logsViewModel();
		    promise = vm.createLogFile();

		    //assert
		    promise.done(function (result) {
		        QUnit.ok(result);
		        QUnit.start();
		    });

		    promise.fail(function () {
		        QUnit.ok(false);
		        QUnit.start();
		    });
		});
    });