/**
 * 
 */
package com.ihsinformatics.aahung.aagahi.model;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.hamcrest.Matchers;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

import com.ihsinformatics.aahung.aagahi.BaseTest;

/**
 * @author owais.hussain@ihsinformatics.com
 */
public class FormTypeTest extends BaseTest {
	
	@Test
	public void testParseFormSchema() {
		
		// A form schema should contain:
		// form label, version, language, fields:[{page:1, order:1, element:element_id, required:true},]
//		house:Gryffindor, Slytherine, Hufflepuff, Ravenclaw
//		person id
//		broom stick:Nimbus 200, Firebolt, Comet
//		role:chaser, beater, keeper, seeker

	}

	@Test
	public void testSchemaSerialization() throws IOException, JSONException {
		FormType ft = FormType.builder().formName("QP Form").build();
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
	public void testSchemaDeserialization() throws JSONException, IOException {
		FormType ft = FormType.builder().formName("QP Form").build();
		ft.setFormSchema("{\"version\":-9.5, \"name\":\"Quidditch Participation Form\"}");
		ft.deserializeSchema();
		Map<String, Object> expected = new HashMap<String, Object>();
		expected.put("version", -9.5);
		expected.put("name", "Quidditch Participation Form");
		Map<String, Object> actual = ft.getFormSchemaMap();
		// Check not null
		assertNotNull(actual);
		// Check size
		assertEquals(expected.size(), actual.size());
		// Match items. The line below will match every item in any map
		assertThat(expected.entrySet(), Matchers.everyItem(Matchers.isIn(actual.entrySet())));
		assertThat(actual.entrySet(), Matchers.everyItem(Matchers.isIn(expected.entrySet())));
	}

}
