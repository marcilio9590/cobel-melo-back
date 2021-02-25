export class Validator {

  constructor(public errors: any[] = []) { }

  isRequired(value, message) {
    if (!value || value.length <= 0)
      this.errors.push({ message: message });
  }

  hasMinLen = (value, min, message) => {
    if (!value || value.length < min)
      this.errors.push({ message: message });
  }

  hasMaxLen = (value, max, message) => {
    if (!value || value.length > max)
      this.errors.push({ message: message });
  }

  isFixedLen = (value, len, message) => {
    if (value.length != len)
      this.errors.push({ message: message });
  }

  isEmail = (value, message) => {
    var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (!reg.test(value))
      this.errors.push({ message: message });
  }

  isGreaterThan = (value, max, message) => {
    if (!value || value > max) {
      this.errors.push({ message: message });
    }
  }

  isPassword(value: string, message: string) {
    const reg = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})/);
    if (!reg.test(value))
      this.errors.push({ message: message });
  }

  isEquals(value: string, value2: string, message: string) {
    if (value !== value2)
      this.errors.push({ message: message });
  }

  clear() {
    this.errors = [];
  }

  isValid() {
    return this.errors.length == 0;
  }

}