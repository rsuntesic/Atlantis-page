// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};

// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());


var DOM = window.DOM || {};
DOM.Methods = {};
DOM.LoadMethod = function(context){
	if( context === undefined ) {
		context = $(document);
	}

	context.find( '*[data-method]' ).each(function(){
		var that 		= $(this),
		    methods 	= that.attr('data-method');

		$.each(methods.split(" "), function(index, methodName){
			try {
				var MethodClass 	  = DOM.Methods[methodName],
				    initializedMethod = new MethodClass(that);
			}
			catch(e) {
				// blank
			}
		});
	});
};
DOM.onReady = function(){
	DOM.LoadMethod();
	$('html').removeClass('no-js').addClass('js');
};

$(document).ready(function(){
	DOM.onReady();
});
