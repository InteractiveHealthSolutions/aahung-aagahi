/**
 * 
 */
package com.ihsinformatics.aahung.aagahi.model;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

import com.ihsinformatics.aahung.aagahi.BaseTest;


/**
 * @author owais.hussain@ihsinformatics.com
 *
 */
public class FormTypeTest extends BaseTest {

	@Test
	public void testSchemaSerialization() throws IOException, JSONException {
		FormType ft = FormType.builder().formName("Test Form").build();
		Map<String, Object> attributes = new HashMap<String, Object>();
	    attributes.put("version", -9.5);
	    attributes.put("name", "Quidditch Participation Form");
	    ft.setFormSchemaMap(attributes);
	    ft.serializeSchema();
	    JSONObject expected = new JSONObject("{\"version\":-9.5, \"name\":\"Quidditch Participation Form\"}");
	    JSONObject actual = new JSONObject(ft.getFormSchema());
	    JSONAssert.assertEquals(expected, actual, true);
	}

	@Test
	public void testSchemaDeserialization() {
		// TODO: Write the deserialization test
	}

}
