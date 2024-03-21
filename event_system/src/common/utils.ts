import { permissionValidTypes } from "../../../backend/src/models/user";

export function isBackoffice(permission: permissionValidTypes){
    return permission !== permissionValidTypes.User;
}