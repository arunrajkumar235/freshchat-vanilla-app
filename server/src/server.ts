import axios from 'axios';
import { dummy } from '@freshworks-jaya/marketplace-models';
import {
  EventPayloadVanilla,
  ProductEventPayloadVanilla,
} from './interfaces/EventPayload';

dummy.trim();

const callWebhook = async (
  webhookUrl: string,
  data: unknown
): Promise<void> => {
  try {
    await axios.post(webhookUrl, JSON.stringify(data));
  } catch (err) {
    return Promise.reject(new Error('Incorrect Webhook url'));
  }

  return Promise.resolve();
};

exports = {
  /**
   * App setup event which is triggered at the time of installation.
   */
  onAppInstallCallback(payload: EventPayloadVanilla): void {
    generateTargetUrl().then(
      (url: string) => {
        $db.set('webhookUrl', { url }).then(
          () => {
            callWebhook(payload.iparams.webhookUrl, {
              externalEventUrl: url,
              ...payload,
            });
            renderData();
          },
          () => {
            callWebhook(payload.iparams.webhookUrl, {
              success: false,
              message: 'Error storing webhook url in db',
            });
            renderData({ message: 'Error storing webhook url in db' });
          }
        );
      },
      () => {
        callWebhook(payload.iparams.webhookUrl, {
          success: false,
          message: 'Webhook registration failed',
        });
        renderData({ message: 'Webhook registration failed' });
      }
    );
  },
  /**
   * When you click the uninstall icon, the `onAppUninstall` event occurs
   * and then the registered callback method is executed.
   */
  onAppUninstallCallback(payload: EventPayloadVanilla): void {
    callWebhook(payload.iparams.webhookUrl, payload);
    renderData();
  },
  /**
   * Payload passed to the `onConversationCreate` callback.
   */
  onConversationCreateCallback(payload: ProductEventPayloadVanilla): void {
    callWebhook(payload.iparams.webhookUrl, payload);
  },
  /**
   * Payload passed to the `onConversationUpdateCallback` callback.
   */
  onConversationUpdateCallback(payload: ProductEventPayloadVanilla): void {
    callWebhook(payload.iparams.webhookUrl, payload);
  },
  /**
   * Payload passed to the `onMessageCreateCallback` callback.
   */
  onMessageCreateCallback(payload: ProductEventPayloadVanilla): void {
    callWebhook(payload.iparams.webhookUrl, payload);
  },
  /**
   * Payload passed to the `onUserCreateCallback` callback.
   */
   onUserCreateCallback(payload: ProductEventPayloadVanilla): void {
    callWebhook(payload.iparams.webhookUrl, payload);
  },
  /**
   * Payload passed to the `onUserUpdateCallback` callback.
   */
   onUserUpdateCallback(payload: ProductEventPayloadVanilla): void {
    callWebhook(payload.iparams.webhookUrl, payload);
  },
  /**
   * Payload passed to the `onUserUpdateCallback` callback.
   */
   onExternalEventCallback(payload: EventPayloadVanilla): void {
    callWebhook(payload.iparams.webhookUrl, payload);
  },
};
