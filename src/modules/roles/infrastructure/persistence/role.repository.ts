import { Role } from '../../domain/role';

export abstract class RoleRepository {
  abstract findAll(): Promise<Role[]>;
  abstract findById(id: Role['id']): Promise<Role | null>;
}
