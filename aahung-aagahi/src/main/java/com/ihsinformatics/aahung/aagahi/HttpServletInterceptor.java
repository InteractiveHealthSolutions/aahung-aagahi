/**
 * 
 */
package com.ihsinformatics.aahung.aagahi;

import java.nio.charset.Charset;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.ihsinformatics.aahung.aagahi.service.SecurityService;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Configuration
public class HttpServletInterceptor extends HandlerInterceptorAdapter {
	
	@Autowired
	private SecurityService securityService;
	
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
	        ModelAndView modelAndView) throws Exception {
		if (request instanceof HttpServletRequest) {
			if (request.getRequestedSessionId() != null && !request.isRequestedSessionIdValid()) {
				// Do nothing
				//response.sendError(HttpServletResponse.SC_FORBIDDEN, "Session timed out");
			}
			if (Context.getCurrentUser() == null) {
				String basicAuth = request.getHeader("Authorization");
				if (basicAuth != null) {
					try {
						basicAuth = basicAuth.substring(6); // remove the "Basic " string
						String decoded = new String(Base64.decodeBase64(basicAuth), Charset.forName("UTF-8"));
						String[] parts = decoded.split(":");
						String user = parts[0];
						String password = parts[1];
						securityService.login(user, password);
					}
					catch (Exception e) {
					}
				}
			}
		}
	}
}
