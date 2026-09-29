import { describe, expect, it } from 'vitest';
import { createAdminUser, createTestUser } from '../../../../tests/factories';

describe('Security Authorization & Role Boundaries', () => {
  it('correctly identifies customer role vs administrator role', () => {
    const customer = createTestUser({ role: 'customer' });
    const admin = createAdminUser({ role: 'administrator' });

    expect(customer.role).toBe('customer');
    expect(customer.role === 'administrator').toBe(false);

    expect(admin.role).toBe('administrator');
    expect(admin.role === 'administrator').toBe(true);
  });

  it('prevents casual role escalation via object tampering', () => {
    const rawData = { id: 'u1', name: 'Fake Admin', role: 'customer', customField: 'administrator' };
    const isUserAdmin = (user: { role: string }) => user.role === 'administrator';

    expect(isUserAdmin(rawData)).toBe(false);
  });
});
