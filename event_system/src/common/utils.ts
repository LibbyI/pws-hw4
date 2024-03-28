import { permissionValidTypes } from "../../../backend/src/models/user";

export function isBackoffice(permission: permissionValidTypes){
    return permission !== permissionValidTypes.User;
}

export const getCookies = (reqCookie: string) =>{
    const cookiesString = document.cookie;
    const cookieMap: { [key: string]: string } = {};
    const cookies = cookiesString.split("; ");

    cookies.forEach(cookie => {
        const [name, value] = cookie.split("=");
        cookieMap[name] = value;
    });
    console.log("cookieMap", cookieMap);
    return cookieMap[reqCookie]??null;
}


export const setCookey = (cookieNmae: string, cookieValue: string, expDate: Date) =>{
    document.cookie = `${cookieNmae}=${cookieValue}; expires=" + ${expDate.toUTCString()} + "; path=/`;
    return;
}