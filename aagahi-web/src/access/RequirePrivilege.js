const hasAccess = (privilegeName) => {

    var user = JSON.parse( sessionStorage.getItem('user'));
    var userRoles = user.userRoles;
    var isAllowed = false;

    // retunr true if user is admin
    if(user.username === "admin") {
      isAllowed = true;
      return isAllowed;
    }

    // check the if the user has the required privilge
    for(let i=0; i < userRoles.length; i++) {
      var rolePrivileges = userRoles[i].rolePrivileges;
      var hasPrivilege = rolePrivileges.filter(privilege => privilege.privilegeName === privilegeName);
      if(hasPrivilege != null && hasPrivilege.length > 0) {
        isAllowed = true;
        return isAllowed;
      }
    }
    return false;
};

const RequirePrivilege = props =>
  hasAccess(props.privilegeName)
    ? props.yes()
    : props.no();

RequirePrivilege.defaultProps = {
  yes: () => null,
  no: () => null
};

export default RequirePrivilege;