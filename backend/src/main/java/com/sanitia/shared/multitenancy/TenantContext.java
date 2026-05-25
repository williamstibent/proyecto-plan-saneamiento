package com.sanitia.shared.multitenancy;

import java.util.UUID;

/**
 * Contexto de tenant por hilo (ThreadLocal).
 * Se pobla en el filtro de request antes de que llegue al servicio,
 * y se limpia al finalizar el request.
 *
 * Uso:
 *   UUID tenantId = TenantContext.getTenantId();
 */
public final class TenantContext {

    private static final ThreadLocal<UUID> CURRENT_TENANT = new ThreadLocal<>();

    private TenantContext() {}

    public static void setTenantId(UUID tenantId) {
        CURRENT_TENANT.set(tenantId);
    }

    public static UUID getTenantId() {
        UUID tenantId = CURRENT_TENANT.get();
        if (tenantId == null) {
            throw new IllegalStateException(
                "No hay tenant en el contexto actual. " +
                "¿Se ejecutó este código fuera de un request HTTP autenticado?"
            );
        }
        return tenantId;
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }
}
