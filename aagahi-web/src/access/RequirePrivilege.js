import { UserService } from '../service/UserService';

const RequirePrivilege = props =>
UserService.hasAccess(props.privilegeName)
    ? props.yes()
    : props.no();

RequirePrivilege.defaultProps = {
  yes: () => null,
  no: () => null
};

export default RequirePrivilege;