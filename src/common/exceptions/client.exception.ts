import { HttpException } from '@nestjs/common';
import { EResponseCode, responseMsgs } from '../consts/response-code';

export class ClientException extends HttpException {
  static InitParamsErr(msg: string) {
    return new ClientException(EResponseCode.params_err, msg);
  }

  static responseCode = EResponseCode;

  constructor(code: EResponseCode, msg?: string) {
    super(msg || responseMsgs[code], code);
  }
}
