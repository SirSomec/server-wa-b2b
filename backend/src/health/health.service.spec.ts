import { HealthService } from './health.service';

describe('HealthService', () => {
  it('should return ok status', () => {
    const service = new HealthService();
    const result = service.check();

    expect(result.status).toBe('ok');
    expect(result.timestamp).toBeDefined();
  });
});
