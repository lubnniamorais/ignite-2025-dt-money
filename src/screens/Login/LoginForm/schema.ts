import { z as zod } from 'zod';

export const schema = zod.object({
  email: zod.string().email('E-mail inválido'),
  password: zod.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});
