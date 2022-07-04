import { EResponseCode, responseMsgs } from 'src/common/consts/response-code';

export class ResponseStruct<T = unknown> {
  code: EResponseCode = EResponseCode.ok;
  msg = responseMsgs[EResponseCode.ok];
  data: T = null;

  constructor(data: T = null, code?: EResponseCode) {
    this.data = data;
    if (code) {
      this.code = code;
      this.msg = responseMsgs[this.code] || '';
    }
  }
}
