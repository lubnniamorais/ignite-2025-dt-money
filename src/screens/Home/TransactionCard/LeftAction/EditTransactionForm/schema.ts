import { z as zod } from 'zod';

export const transactionSchema = zod.object({
  description: zod.string().min(1, 'A descrição é obrigatória.'),
  value: zod.number().min(1, 'O valor é obrigatório.'),
  typeId: zod.number().min(1, 'O tipo de transação é obrigatório.'),
  categoryId: zod.number().min(1, 'O tipo de categoria é obrigatório.'),
});
