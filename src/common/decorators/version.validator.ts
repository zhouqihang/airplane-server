import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Validator class used to validate Version string.
 * useage:
 *  @Validate(VersionCodeValidator)
 */
@ValidatorConstraint({ name: 'isVersion', async: false })
export class VersionCodeValidator implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    return /^\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value);
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'Version must be like "0.0.1", the max value is "999.999.999"';
  }
}

/**
 * Decorator for VersionCodeValidator. Use @IsVersion() to validate you version string.
 * @param validationOptions ValidationOptions
 * @returns decorator
 */
export function IsVersion(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: VersionCodeValidator,
    });
  };
}
