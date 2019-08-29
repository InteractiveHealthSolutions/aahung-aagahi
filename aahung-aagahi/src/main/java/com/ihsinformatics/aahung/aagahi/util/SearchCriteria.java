
package com.ihsinformatics.aahung.aagahi.util;

import lombok.Getter;
import lombok.Setter;

/**
 * @author rabbia.hassan@ihsinformatics.com
 */

@Getter
@Setter
public class SearchCriteria {
	
	private String key;
    private SearchOperator operator;
    private Object value;

    public SearchCriteria() {

    }
    
    public SearchCriteria(final String key, final SearchOperator operator, final Object value) {
        super();
        this.key = key;
        this.operator = operator;
        this.value = value;
    }

}
