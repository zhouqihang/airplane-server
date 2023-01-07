import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projectRequest')
export class ProjectRequest {
  static init() {
    const pr = new ProjectRequest();
    pr.prefixs = '{"prefixs":[]}';
    pr.domains = '{"domains":[]}';
    return pr;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  prefixs: string;

  @Column({ type: 'smallint', unsigned: true, default: 3000 })
  timeout: number;

  @Column({ type: 'json' })
  domains: string;

  @Column({ type: 'boolean', default: false })
  isHttps: boolean;

  @Column({
    type: 'datetime',
    default: () => 'NOW()',
  })
  updateTime: string;

  @BeforeUpdate()
  onBeforeUpdate() {
    this.updateTime = new Date().toISOString();
  }
}
