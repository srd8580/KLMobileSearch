define([], function () {
    var searchFieldProperty = function(id, name, type, operator, condition1, condition2, conjunction) {
        var self = this;
        
		self.id = id;        
        self.name = name; 
        self.type = type;
        self.operator = operator;
        self.condition1 = condition1 ? condition1 : "";
        self.condition2 = condition2 ? condition2 : "";        
        self.conjunction = conjunction;
              
        return self;
    };
    
    return searchFieldProperty;
});