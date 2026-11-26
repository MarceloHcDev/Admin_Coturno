/**
 * Utilitário de sincronização em tempo real entre abas (Admin e Cliente)
 * Emite notificações via BroadcastChannel e LocalStorage para que o e-commerce
 * atualize imediatamente o status do pedido na tela do cliente.
 */

export interface OrderUpdateMessage {
  orderId?: string | number;
  status?: string;
  trackingCode?: string | null;
  timestamp: number;
}

const CHANNEL_NAME = 'coturnos_order_updates';
const STORAGE_KEY = 'coturnos_order_update_event';

export function notifyOrderUpdate(payload: Partial<OrderUpdateMessage> = {}): void {
  const message: OrderUpdateMessage = {
    ...payload,
    timestamp: Date.now(),
  };

  // 1. BroadcastChannel (modern browsers)
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage(message);
      channel.close();
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }
  }

  // 2. LocalStorage Event (cross-tab fallback)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(message));
  } catch (e) {
    // ignore
  }
}
