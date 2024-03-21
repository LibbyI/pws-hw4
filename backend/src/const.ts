
export const POST_ORDER = "POST /api/order";
export const PUT_ITEM = "PUT /api/inventory";
export const GET_USER = `GET /api/user/`;
export const LOGIN = `POST /api/login`;
export const SIGNUP = `POST /api/signup`;
export const LOGOUT= `POST /api/logout`;
export const GET_COMMENTS = `GET /comments/`;
export const ADD_COMMENT = `POST /addComment/`;
// export const TIMEOUT = 10000;
export const TIMEOUT = 120000;
// export const INTERVAL_CLEAN_TRIGGER = 5000;
export const INTERVAL_CLEAN_TRIGGER = 120000;


export const ERROR_401 = "ERROR_401";

export const PAYMENT_URL = "https://www.cs-wsp.net/_functions/pay";
export const PAYMENT_REFUND_URL = "https://www.cs-wsp.net/_functions/refund";


export const options = {
    dbName: 'hw4', 
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

export interface updateEventTickets {
  eventId: string;
  quantity: Number;
  name: string;
}

export interface orederExpiredDate {
  orderId: string;
  expiredDate: Date;
}