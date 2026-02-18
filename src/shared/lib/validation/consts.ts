const NAME_REGEX = /^[A-ZА-ЯЁ][a-zA-Zа-яА-ЯЁё-]*$/;
const SURNAME_REGEX = /^[A-ZА-ЯЁ][a-zA-Zа-яА-ЯЁё-]*$/;
const LOGIN_REGEX = /^[A-ZА-ЯЁ][a-zA-Zа-яА-ЯЁё-]{2,19}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,40}$/;
const PHONE_REGEX = /^\+?\d{10,15}$/;
const DISPLAY_NAME_REGEX = /^[A-ZА-ЯЁ][a-zA-Zа-яА-ЯЁё-]*$/;

export {
  DISPLAY_NAME_REGEX,
  EMAIL_REGEX,
  LOGIN_REGEX,
  NAME_REGEX,
  PASSWORD_REGEX,
  PHONE_REGEX,
  SURNAME_REGEX
};

const NAME_ERROR = "Странное имя.";
const SURNAME_ERROR = "Странная у вас фамилия.";
const LOGIN_ERROR = "Нужна заглавная буква, длина – 3-20 символов.";
const EMAIL_ERROR = "Невалидная почта.";
const PASSWORD_ERROR = "8-40 символов, минимум 1 цифра и заглавная буква.";
const PHONE_ERROR = "Неправильный номер телефона.";
const DISPLAY_NAME_ERROR = "Странный ник.";

export {
  DISPLAY_NAME_ERROR,
  EMAIL_ERROR,
  LOGIN_ERROR,
  NAME_ERROR,
  PASSWORD_ERROR,
  PHONE_ERROR,
  SURNAME_ERROR
};

