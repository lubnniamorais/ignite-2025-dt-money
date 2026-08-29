import { z as zod } from 'zod';

export const schema = zod
  .object({
    name: zod.string(),
    email: zod.string().email('E-mail inválido'),
    password: zod.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: zod.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'], // Define em qual campo o erro será exibido
  });
