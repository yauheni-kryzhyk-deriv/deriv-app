import React from 'react';
import { useRemoteConfig } from '@deriv/api';
import { useDevice } from '@deriv-com/ui';
import { useIsMounted } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { browserSupportsWebAuthn } from '@simplewebauthn/browser';
import P2PIFrame from 'Modules/P2PIFrame';
import SmartTraderIFrame from 'Modules/SmartTraderIFrame';
import ErrorBoundary from './Components/Elements/Errors/error-boundary.jsx';
import AppToastMessages from './Containers/app-toast-messages.jsx';
import AppContents from './Containers/Layout/app-contents.jsx';
import Footer from './Containers/Layout/footer.jsx';
import Header from './Containers/Layout/header';
import AppModals from './Containers/Modals';
import Routes from './Containers/Routes/routes.jsx';
import Devtools from './Devtools';
import LandscapeBlocker from './Components/Elements/LandscapeBlocker';
import initDatadog from '../Utils/Datadog';
import { ThemeProvider } from '@deriv-com/quill-ui';
import { useGrowthbookIsOn, useLiveChat } from '@deriv/hooks';
import { useTranslations } from '@deriv-com/translations';

const AppContent: React.FC<{ passthrough: unknown }> = observer(({ passthrough }) => {
    const store = useStore();
    const {
        has_wallet,
        is_logged_in,
        loginid,
        is_client_store_initialized,
        landing_company_shortcode,
        currency,
        residence,
        email,
        setIsPasskeySupported,
        account_settings,
    } = store.client;
    const { first_name, last_name } = account_settings;
    const { current_language, changeSelectedLanguage } = store.common;
    const { is_dark_mode_on, setDarkMode } = store.ui;

    const { isMobile } = useDevice();
    const { switchLanguage } = useTranslations();

    const [isWebPasskeysFFEnabled, isGBLoaded] = useGrowthbookIsOn({
        featureFlag: 'web_passkeys',
    });
    const [isServicePasskeysFFEnabled] = useGrowthbookIsOn({
        featureFlag: 'service_passkeys',
    });
    const isMounted = useIsMounted();
    const { data } = useRemoteConfig(isMounted());
    const { tracking_datadog } = data;
    const is_passkeys_supported = browserSupportsWebAuthn();

    const livechat_client_information: Parameters<typeof useLiveChat>[0] = {
        is_client_store_initialized,
        is_logged_in,
        loginid,
        landing_company_shortcode,
        currency,
        residence,
        email,
        first_name,
        last_name,
    };

    useLiveChat(livechat_client_information);

    React.useEffect(() => {
        switchLanguage(current_language);
    }, [current_language, switchLanguage]);

    React.useEffect(() => {
        if (isGBLoaded && isWebPasskeysFFEnabled && isServicePasskeysFFEnabled) {
            setIsPasskeySupported(
                is_passkeys_supported && isServicePasskeysFFEnabled && isWebPasskeysFFEnabled && isMobile
            );
        }
    }, [
        isServicePasskeysFFEnabled,
        isGBLoaded,
        isWebPasskeysFFEnabled,
        is_passkeys_supported,
        isMobile,
        setIsPasskeySupported,
    ]);

    React.useEffect(() => {
        initDatadog(tracking_datadog);
    }, [tracking_datadog]);

    // intentionally switch the user with wallets to light mode and EN language
    React.useLayoutEffect(() => {
        if (has_wallet) {
            if (is_dark_mode_on) {
                setDarkMode(false);
            }
            if (current_language !== 'EN') {
                changeSelectedLanguage('EN');
            }
        }
    }, [has_wallet, current_language, changeSelectedLanguage, is_dark_mode_on, setDarkMode]);

    return (
        <ThemeProvider theme={is_dark_mode_on ? 'dark' : 'light'}>
            <LandscapeBlocker />
            <Header />
            <ErrorBoundary root_store={store}>
                <AppContents>
                    {/* TODO: [trader-remove-client-base] */}
                    <Routes passthrough={passthrough} />
                </AppContents>
            </ErrorBoundary>
            <Footer />
            <ErrorBoundary root_store={store}>
                <AppModals />
            </ErrorBoundary>
            <SmartTraderIFrame />
            <P2PIFrame />
            <AppToastMessages />
            <Devtools />
        </ThemeProvider>
    );
});

export default AppContent;
