/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

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

    @Override
    public String toString() {
	return this.key + ", " + this.operator + ", " + this.value;
    }
}
