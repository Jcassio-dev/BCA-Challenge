import { ValidationPipe } from './validation.pipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

jest.mock('class-validator');
jest.mock('class-transformer');

class TestDto {
  name: string;
  age: number;
}

describe('ValidationPipe', () => {
  let pipe: ValidationPipe;
  const mockMetadata: ArgumentMetadata = { type: 'body', metatype: TestDto };

  beforeEach(() => {
    pipe = new ValidationPipe();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should return value if no metatype', async () => {
      const value = { test: 'value' };
      const result = await pipe.transform(value, {
        type: 'body',
      } as ArgumentMetadata);

      expect(result).toBe(value);
    });

    it('should throw BadRequestException for null value', async () => {
      await expect(pipe.transform(null, mockMetadata)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for undefined value', async () => {
      await expect(pipe.transform(undefined, mockMetadata)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should validate and transform valid data', async () => {
      const validData = { name: 'John', age: 30 };
      const mockInstance = plainToInstance(TestDto, validData);

      (plainToInstance as jest.Mock).mockReturnValue(mockInstance);
      (validate as jest.Mock).mockResolvedValue([]);

      const result = await pipe.transform(validData, mockMetadata);

      expect(plainToInstance).toHaveBeenCalledWith(TestDto, validData);
      expect(validate).toHaveBeenCalledWith(mockInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        stopAtFirstError: false,
      });
      expect(result).toBe(mockInstance);
    });

    it('should throw BadRequestException for invalid data', async () => {
      const invalidData = { name: 'John', age: 'not-a-number' };
      const mockInstance = plainToInstance(TestDto, invalidData);
      const mockErrors = [
        {
          property: 'age',
          constraints: { isNumber: 'age must be a number' },
        },
      ];

      (plainToInstance as jest.Mock).mockReturnValue(mockInstance);
      (validate as jest.Mock).mockResolvedValue(mockErrors);

      await expect(pipe.transform(invalidData, mockMetadata)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle non-whitelisted properties', async () => {
      const dataWithExtra = { name: 'John', age: 30, extra: 'field' };
      const mockInstance = plainToInstance(TestDto, dataWithExtra);
      const mockErrors = [
        {
          property: 'extra',
          constraints: {
            whitelistValidation: 'property extra should not exist',
          },
        },
      ];

      (plainToInstance as jest.Mock).mockReturnValue(mockInstance);
      (validate as jest.Mock).mockResolvedValue(mockErrors);

      await expect(pipe.transform(dataWithExtra, mockMetadata)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('toValidate', () => {
    it('should return false for built-in types', () => {
      expect(pipe['toValidate'](String)).toBe(false);
      expect(pipe['toValidate'](Number)).toBe(false);
      expect(pipe['toValidate'](Boolean)).toBe(false);
      expect(pipe['toValidate'](Array)).toBe(false);
      expect(pipe['toValidate'](Object)).toBe(false);
    });

    it('should return true for custom classes', () => {
      expect(pipe['toValidate'](TestDto)).toBe(true);
    });
  });

  describe('formatErrors', () => {
    it('should format validation errors correctly', () => {
      const mockErrors = [
        {
          property: 'age',
          value: 'not-a-number',
          constraints: { isNumber: 'age must be a number' },
          children: [],
        },
      ];

      const formatted = pipe['formatErrors'](mockErrors);

      expect(formatted).toEqual([
        {
          field: 'age',
          value: 'not-a-number',
          constraints: { isNumber: 'age must be a number' },
          children: [],
        },
      ]);
    });

    it('should handle nested errors', () => {
      const mockErrors = [
        {
          property: 'address',
          value: {},
          children: [
            {
              property: 'street',
              value: '',
              constraints: { isNotEmpty: 'street should not be empty' },
              children: [],
            },
          ],
        },
      ];

      const formatted = pipe['formatErrors'](mockErrors);

      expect(formatted[0].children).toHaveLength(1);
    });
  });
});
