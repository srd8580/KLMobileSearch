define(["jquery", "application", "domain/searchFieldProperty", "domain/Constants", "services/dateTimeConverter", "extensions"],
        function ($, application, searchFieldProperty, Constants, DateTimeConverter) {
        
		var searchParsingService = function () {
			var self = this;
        
            self.getSearchFieldPropertiesFromKlaml = function (klaml) {
                var klamlSearchFieldProperties = [],
					idProperty = "id",
                    nameProperty = "displayName",
                    typeProperty = "type",
                    operatorProperty = "operator",
                    conditionProperty = "condition",
                    conjunctionProperty = "conjunction";
                
                if(klaml)
                {
                    var fields = $(klaml).find("where").find("field");
                    
                    if(fields)
                    {
                        var fieldsLength = fields.length;
                        
                        for(var i = 0; i < fieldsLength; i++)
                        {
                            if(fields[i])
                            {                                
                                klamlSearchFieldProperties.push(new searchFieldProperty($(fields[i]).attr(idProperty),
																						$(fields[i]).attr(nameProperty), 
                                                                                        $(fields[i]).attr(typeProperty),
                                                                                        self.GetSearchPropertyOperator($(fields[i]).attr(operatorProperty)), 
                                                                                        $(fields[i]).attr(conditionProperty), 
                                                                                        "",
                                                                                        ($(fields[i]).attr(conjunctionProperty)).parseConjunctionToBool()));                                
                            }
                        }
                    }
                }
                
                return self.refineSearchFieldProperties(klamlSearchFieldProperties);
            }
            
            self.refineSearchFieldProperties = function (searchProperties) {                
                if(searchProperties)
                {
                    var searchPropertiesLength = searchProperties.length;
                    
                    for(var i = 0; i < searchPropertiesLength; i++)
                    {
                        if(searchProperties[i].id && searchProperties[i].id !== "")
                        {
                            for(var j = i + 1; j < searchPropertiesLength; j++)
                            {
                                if(searchProperties[j].id && searchProperties[j].id !== "")
                                {                                    
                                    if(searchProperties[i].id === searchProperties[j].id)
                                    {
                                        if(searchProperties[i].type === Constants.dateTimeComparator)
                                            searchProperties[i].operator = self.determineOperatorForDateTime(searchProperties, i, j);
                                        
                                        else
                                            searchProperties[i].operator = application.strings.Range;
                                        
                                        searchProperties[i].condition2 = searchProperties[j].condition1;
                                        searchProperties[i].conjunction = searchProperties[j].conjunction;
                                                                                
                                        searchProperties.splice(j, 1);                                        
                                        searchPropertiesLength = searchProperties.length;
                                        
                                        break;
                                    }
                                }
                            }
                        }
                        
                        else if(searchProperties[i].type && searchProperties[i].type === Constants.dateTimeComparator &&
                                searchProperties[i].operator && searchProperties[i].operator === Constants.greaterThanOrEqualOperator)
                        {
                             searchProperties[i].condition1 = DateTimeConverter.adjustDateTime(searchProperties[i].condition1, 1000, "+");
                        }                        
                    }                    
                }
                
                return searchProperties;
            }
            
            self.determineOperatorForDateTime = function (searchProperties, index, duplicateIndex) {
                var operator = application.strings.Range;
                
                if(searchProperties)
                {                    
                    if(DateTimeConverter.isDateEqual(searchProperties[index].condition1, searchProperties[duplicateIndex].condition1))
                        operator = "=";                    
                }
                
                return operator;
            }

            self.getKeywordFromKlaml = function (klaml) {
                var keyword = "",
                    keywordIdentifier = "CDATA[",
                    keywordSeperator = "]";

                if(klaml)
                {
                    var startIndex = klaml.indexOf(keywordIdentifier);

                    if (startIndex !== -1)
                    {
                        var endIndex = klaml.indexOf(keywordSeperator, startIndex);

                        if (endIndex !== -1) 
                            keyword = klaml.substring(startIndex + keywordIdentifier.length, endIndex);
                    }
                }

                return keyword; 
            }

            self.GetSearchPropertyOperator = function(operatorToken)
            {
                if(operatorToken)
                {
                    operatorToken = operatorToken.toLowerCase(); 
                    
                    if (operatorToken === Constants.containsComparator)
                    {
                        return application.strings.Contains;
                    }
        
                    if (operatorToken === Constants.beginsWithComparator)
                    {
                        return application.strings.StartsWith;
                    }
        
                    if (operatorToken === Constants.isNotNullComparator)
                    {
                        return application.strings.IsNotNull;
                    }
        
                    switch (operatorToken)
                    {
                        case "eq":
                            return "=";
                        case "lt":
                            return "<";
                        case "leq":
                            return "<=";
                        case "gt":
                            return ">";
                        case "geq":
                            return ">=";
                        default:
                            return operatorToken;
                    }
                }
                
                return operatorToken;
            }
			
			return self;
        };
		
		return searchParsingService;
    });
