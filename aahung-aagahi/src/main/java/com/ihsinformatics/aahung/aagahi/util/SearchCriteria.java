
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
    private String operation;
    private Object value;

    public SearchCriteria() {

    }
    
    public SearchCriteria(final String key, final String operation, final Object value) {
        super();
        this.key = key;
        this.operation = operation;
        this.value = value;
    }

}
