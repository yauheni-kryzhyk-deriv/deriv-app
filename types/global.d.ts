import { TLiveChatWidget } from './livechat';

declare global {
    interface Window {
        clipboardData: DataTransfer;
        LiveChatWidget: TLiveChatWidget;
        TrackJS: { console: { log: (arg0: unknown[]) => void }; track: (arg0: object) => void };
        Blockly;
        Onfido: {
            init: (args: any) => any;
        };
        DD_RUM: object | undefined;
    }
}

export {};
