import { Column, Entity, PrimaryColumn } from 'typeorm';

import { EntityRelationalHelper } from '../../../../../../utils/relational-entity-helper';

@Entity({
  name: 'statuses',
})
export class StatusEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name?: string;
}
