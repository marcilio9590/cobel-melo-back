import { Injectable } from '@nestjs/common';
import { ResetPasswordDTO } from '../../dtos/reset-password.dto';
import { Validator } from '../../utils/validator';
import { Contract } from '../contract';

@Injectable()
export class ResetPasswordContract implements Contract {

  errors: any[];

  validate(model: ResetPasswordDTO): boolean {
    const validator = new Validator();
    validator.isEmail(model.username, 'Email inválido');
    validator.isPassword(model.password, 'Senha inválida');
    validator.isPassword(model.confirmPassword, 'Confirmação de senha inválida');
    validator.isEquals(model.password, model.confirmPassword, 'As senhas não são iguais');

    this.errors = validator.errors;
    return validator.isValid();
  }


}