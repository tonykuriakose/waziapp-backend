import {z} from "zod"



export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  useCase: z.string().min(1, 'Use case is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']),
  tenantId: z.string().uuid().optional()
});


export type CreateProjectInput = z.infer<typeof createProjectSchema>;
