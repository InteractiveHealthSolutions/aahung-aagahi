/**
 * 
 */
package com.ihsinformatics.aahung.aagahi.model;

import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.ihsinformatics.aahung.aagahi.util.DateDeserializer;
import com.ihsinformatics.aahung.aagahi.util.DateSerializer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@AllArgsConstructor // Lombok creates a constructor with all arguments
@MappedSuperclass
@JsonIgnoreProperties(value = { "createdBy", "dateCreated", "updatedBy", "dateUpdated", "voidedBy",
        "dateVoided" }, allowGetters = true)
@Getter
@Setter
public class BaseEntity implements java.io.Serializable {

	private static final long serialVersionUID = 8285188380681580423L;

	private static GsonBuilder builder = new GsonBuilder().registerTypeAdapter(Date.class, new DateDeserializer())
	        .registerTypeAdapter(Date.class, new DateSerializer()).setPrettyPrinting();

	@Getter
	private static Gson gson;

	@Column(name = "uuid", updatable = false, nullable = false)
	private String uuid;

	@ManyToOne
	@JoinColumn(name = "createdBy", nullable = false)
	private Users createdBy;

	@Column(nullable = false, updatable = false)
	@Temporal(TemporalType.TIMESTAMP)
	private Date dateCreated;

	@ManyToOne
	@JoinColumn(name = "updatedBy", nullable = true)
	private Users updatedBy;

	@Column(nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	private Date dateUpdated;

	@ManyToOne
	@JoinColumn(name = "voidedBy", nullable = true)
	private Users voidedBy;

	@Column(nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	private Date dateVoided;

	public BaseEntity() {
		this.uuid = UUID.randomUUID().toString();
		initGson();
	}

	private static void initGson() {
		BaseEntity.gson = builder.create();
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((uuid == null) ? 0 : uuid.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		BaseEntity other = (BaseEntity) obj;
		if (uuid == null) {
			if (other.uuid != null)
				return false;
		} else if (!uuid.equals(other.uuid)) {
			return false;
		}
		return true;
	}
}
