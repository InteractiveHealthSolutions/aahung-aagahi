package com.ihsinformatics.aahung.aagahi.web;

import java.io.IOException;
import java.nio.charset.Charset;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.ihsinformatics.aahung.aagahi.Initializer;
import com.ihsinformatics.aahung.aagahi.service.SecurityService;

/**
 * @author owais.hussain@ihsinformatics.com
 * Allows the user to authenticate via Basic authentication
 */
public class AuthorizationFilter implements Filter {

	@Autowired
	private SecurityService securityService;

	protected final Log LOG = LogFactory.getLog(getClass());

	/*
	 * (non-Javadoc)
	 * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
	 */
	@Override
	public void init(FilterConfig config) throws ServletException {
		LOG.debug("Initializing Authorization filter");
	}

	/*
	 * (non-Javadoc)
	 * @see javax.servlet.Filter#destroy()
	 */
	@Override
	public void destroy() {
		LOG.debug("Destroying Authorization filter");
	}

	/**
	 * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest,
	 *      javax.servlet.ServletResponse, javax.servlet.FilterChain)
	 */
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
	        throws IOException, ServletException {
		if (request instanceof HttpServletRequest) {
			HttpServletRequest httpRequest = (HttpServletRequest) request;
			if (httpRequest.getRequestedSessionId() != null && !httpRequest.isRequestedSessionIdValid()) {
				HttpServletResponse httpResponse = (HttpServletResponse) response;
				httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "Session timed out");
			}
			if (Initializer.getCurrentUser() == null) {
				String basicAuth = httpRequest.getHeader("Authorization");
				if (basicAuth != null) {
					try {
						basicAuth = basicAuth.substring(6); // remove the "Basic " string
						String decoded = new String(Base64.decodeBase64(basicAuth), Charset.forName("UTF-8"));
						String[] parts = decoded.split(":");
						String user = parts[0];
						String password = parts[1];
						securityService.login(user, password);
					}
					catch (Exception ex) {}
				}
			}
		}
		chain.doFilter(request, response);
	}
}
