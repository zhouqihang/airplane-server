import { HttpException } from '@nestjs/common';
import { EResponseCode, responseMsgs } from '../consts/response-code';

export class ClientException extends HttpException {
  static responseCode = EResponseCode;

  constructor(code: EResponseCode) {
    super(responseMsgs[code], code);
  }
}
