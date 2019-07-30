/* Copyright(C) 2019 Interactive Health Solutions, Pvt. Ltd.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Interactive Health Solutions, info@ihsinformatics.com
You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html

Interactive Health Solutions, hereby disclaims all copyright interest in this program written by the contributors.
*/

package com.ihsinformatics.aahung.aagahi;

import java.time.LocalDate;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @author owais.hussain@ihsinformatics.com
 */
@Configuration
@EnableWebSecurity
@EnableSwagger2
public class WebConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private DataSource dataSource;

	@Bean
	public Docket api() {
		return new Docket(DocumentationType.SWAGGER_2).select().apis(RequestHandlerSelectors.any())
		        .paths(PathSelectors.any()).build();
	}

	/**
	 * Provides In-memory authentication to test Swagger API. There is only one user 'admin' and the
	 * password is calculed from date (day * month * year)
	 * 
	 * @param auth
	 * @return
	 * @throws Exception
	 */
	public AuthenticationManagerBuilder getInMemoryAuthenticationService(AuthenticationManagerBuilder auth)
	        throws Exception {
		InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
		LocalDate date = LocalDate.now();
		String todaysPassword = "{noop}" + (date.getYear() * date.getMonthValue() * date.getDayOfMonth());
		manager.createUser(org.springframework.security.core.userdetails.User.withUsername("admin").password(todaysPassword)
		        .roles("ADMIN").build());
		auth.userDetailsService(manager);
		return auth;
	}

	/**
	 * Provides JDBC authentication to test Swagger API. User authentication and roles are read from
	 * the database
	 * 
	 * @param auth
	 * @return
	 * @throws Exception
	 */
	public AuthenticationManagerBuilder getDataSourceAuthenticationService(AuthenticationManagerBuilder auth)
	        throws Exception {
		PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		auth.jdbcAuthentication().dataSource(dataSource);
		auth.jdbcAuthentication()
		        .usersByUsernameQuery("SELECT username, password, voided FROM users WHERE username = ? and voided = 0");
		auth.jdbcAuthentication().authoritiesByUsernameQuery(
		    "SELECT u.username, r.role_id FROM users u, user_role r WHERE u.username = ? and y.user_id = u.user_id");
		auth.jdbcAuthentication().passwordEncoder(passwordEncoder);
		return auth;
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable();
		http.authorizeRequests().antMatchers("/v2/api-docs").authenticated().and().httpBasic();
	}

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth = getInMemoryAuthenticationService(auth);
	}
}
